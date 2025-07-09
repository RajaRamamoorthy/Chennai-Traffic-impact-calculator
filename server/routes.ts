import type { Express } from "express";
import { createServer, type Server } from "http";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { impactCalculator } from "./services/impact-calculator";
import { RoutingService } from "./services/routing-service";
import { emailService } from "./services/email-service";
import { insertCalculationSchema, insertFeedbackSchema, insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Rate limiting middleware for contact form
  const contactRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: {
      error: "Too many contact form submissions. Please try again later.",
      retryAfter: "15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      const stats = await storage.getCalculationStats();
      res.json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        stats 
      });
    } catch (error) {
      res.status(500).json({ 
        status: "unhealthy", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get vehicle types
  app.get("/api/vehicle-types", async (req, res) => {
    try {
      const { category } = req.query;
      let vehicleTypes;

      console.log("Fetching vehicle types for category:", category);

      if (category && typeof category === 'string') {
        vehicleTypes = await storage.getVehicleTypesByCategory(category);
      } else {
        vehicleTypes = await storage.getVehicleTypes();
      }

      console.log("Found vehicle types:", vehicleTypes?.length || 0);
      res.json(vehicleTypes);
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
      res.status(500).json({ 
        error: "Failed to fetch vehicle types",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Geocoding endpoint
  app.post("/api/geocode", async (req, res) => {
    try {
      const { address } = req.body;

      if (!address || typeof address !== 'string') {
        return res.status(400).json({ error: "Address is required" });
      }

      const location = await RoutingService.geocodeAddress(address);

      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }

      res.json(location);
    } catch (error) {
      console.error("Geocoding error:", error);
      res.status(500).json({ 
        error: "Geocoding failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Route information endpoint
  app.post("/api/route-info", async (req, res) => {
    try {
      const { origin, destination } = req.body;

      if (!origin || !destination) {
        return res.status(400).json({ error: "Origin and destination are required" });
      }

      const routeInfo = await RoutingService.getRouteInfo(origin, destination);

      if (!routeInfo) {
        return res.status(404).json({ error: "Route not found" });
      }

      res.json(routeInfo);
    } catch (error) {
      console.error("Route info error:", error);
      res.status(500).json({ 
        error: "Failed to get route information",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Place autocomplete endpoint
  app.get("/api/places/autocomplete", async (req, res) => {
    try {
      const { input } = req.query;

      if (!input || typeof input !== 'string') {
        return res.status(400).json({ error: "Input query is required" });
      }

      const predictions = await RoutingService.getPlaceAutocomplete(input);
      res.json(predictions);
    } catch (error) {
      console.error("Autocomplete error:", error);
      res.status(500).json({ 
        error: "Autocomplete failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Calculate traffic impact
  app.post("/api/calculate-impact", async (req, res) => {
    try {
      // Validate input
      const calculationInput = insertCalculationSchema.extend({
        vehicleTypeId: z.number().optional(),
        distanceKm: z.number().positive(),
      }).parse(req.body);

      // Get session ID from headers or generate one
      const sessionId = req.headers['x-session-id'] as string || `session_${Date.now()}_${Math.random()}`;

      // Calculate impact
      const result = await impactCalculator.calculate({
        transportMode: calculationInput.transportMode,
        vehicleTypeId: calculationInput.vehicleTypeId,
        occupancy: calculationInput.occupancy,
        distanceKm: calculationInput.distanceKm,
        timing: calculationInput.timing,
        frequency: calculationInput.frequency,
        sessionId,
        origin: calculationInput.origin,
        destination: calculationInput.destination
      });

      res.json(result);

    } catch (error) {
      console.error("Calculation error:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid input data",
          details: error.errors
        });
      }

      res.status(500).json({ 
        error: "Failed to calculate impact",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Submit feedback
  app.post("/api/feedback", async (req, res) => {
    try {
      const feedbackData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(feedbackData);
      res.json({ success: true, feedback });
    } catch (error) {
      console.error("Feedback error:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid feedback data",
          details: error.errors
        });
      }

      res.status(500).json({ 
        error: "Failed to submit feedback",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Submit contact form
  app.post("/api/contact", contactRateLimit, async (req, res) => {
    try {
      const contactData = insertContactSubmissionSchema.parse(req.body);
      
      // Get client IP and user agent
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      const userAgent = req.get('User-Agent') || 'unknown';

      // Check for recent submissions from this IP (additional rate limiting)
      const recentSubmissions = await storage.getRecentContactSubmissions(ipAddress, 60);
      if (recentSubmissions.length >= 3) {
        return res.status(429).json({
          error: "Too many submissions from this IP address. Please try again later."
        });
      }

      // Create contact submission record
      const submission = await storage.createContactSubmission({
        ...contactData,
        ipAddress,
        userAgent
      });

      // Send email notification
      try {
        const emailSent = await emailService.sendContactEmail({
          name: contactData.name,
          email: contactData.email,
          message: contactData.message,
          submittedAt: new Date().toLocaleString()
        });

        // Update submission status
        await storage.updateContactSubmissionStatus(
          submission.id, 
          emailSent ? 'sent' : 'failed'
        );

        res.json({ 
          success: true, 
          message: "Thank you for your message. We'll get back to you soon!" 
        });

      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        
        // Update submission status to failed
        await storage.updateContactSubmissionStatus(submission.id, 'failed');
        
        // Still return success to user (we have their message stored)
        res.json({ 
          success: true, 
          message: "Your message has been received. We'll get back to you soon!" 
        });
      }

    } catch (error) {
      console.error("Contact submission error:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid contact data",
          details: error.errors
        });
      }

      res.status(500).json({ 
        error: "Failed to submit contact form",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get user's previous calculations
  app.get("/api/calculations", async (req, res) => {
    try {
      const sessionId = req.headers['x-session-id'] as string;

      if (!sessionId) {
        return res.status(400).json({ error: "Session ID required" });
      }

      const calculations = await storage.getCalculationsBySessionId(sessionId);
      res.json(calculations);
    } catch (error) {
      console.error("Error fetching calculations:", error);
      res.status(500).json({ 
        error: "Failed to fetch calculations",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}