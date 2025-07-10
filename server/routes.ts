import type { Express } from "express";
import { createServer, type Server } from "http";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { impactCalculator } from "./services/impact-calculator";
import { RoutingService } from "./services/routing-service";
import { emailService } from "./services/email-service";
import { insertCalculationSchema, insertFeedbackSchema, insertContactSubmissionSchema, contactSubmissions } from "@shared/schema";
import { z } from "zod";
import { desc } from "drizzle-orm";
import { db } from "./db";

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
          emailSent ? 'sent' : 'pending'
        );

        // Always return success - message is stored in database
        res.json({ 
          success: true, 
          message: "Thank you for your message. We'll get back to you soon!" 
        });

        // Log the contact submission for manual processing
        console.log('=== NEW CONTACT FORM SUBMISSION ===');
        console.log('Name:', contactData.name);
        console.log('Email:', contactData.email);
        console.log('Message:', contactData.message);
        console.log('Submitted:', new Date().toLocaleString());
        console.log('Status:', emailSent ? 'Email sent' : 'Email failed - stored in database');
        console.log('=====================================');

      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        
        // Update submission status to failed but still return success
        await storage.updateContactSubmissionStatus(submission.id, 'failed');
        
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

  // Test email connection endpoint
  app.get("/api/test-email", async (req, res) => {
    try {
      const isConnected = await emailService.testConnection();
      res.json({ 
        connected: isConnected,
        message: isConnected ? "Email service is working" : "Email service connection failed",
        config: {
          host: process.env.SMTP_HOST || 'smtp.zoho.com',
          port: process.env.SMTP_PORT || '587',
          user: process.env.SMTP_USER || 'Not set',
          hasPassword: !!process.env.SMTP_PASS,
          fromEmail: process.env.SMTP_FROM_EMAIL || 'Not set',
          contactEmail: process.env.CONTACT_EMAIL || 'contact@chennaitrafficcalc.in'
        }
      });
    } catch (error) {
      console.error("Email test error:", error);
      res.status(500).json({ 
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Send test email endpoint
  app.post("/api/send-test-email", async (req, res) => {
    try {
      const result = await emailService.sendContactEmail({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test email to verify the Chennai Traffic Impact Calculator contact form is working.',
        submittedAt: new Date().toLocaleString()
      });
      
      res.json({ 
        success: result,
        message: result ? "Test email sent successfully!" : "Failed to send test email"
      });
    } catch (error) {
      console.error("Test email send error:", error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get Razorpay config for frontend
  app.get("/api/razorpay-config", (req, res) => {
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    
    if (!razorpayKeyId) {
      return res.status(500).json({ error: "Razorpay configuration missing" });
    }
    
    res.json({ keyId: razorpayKeyId });
  });

  // Get contact submissions (for admin access)
  app.get("/api/admin/contact-submissions", async (req, res) => {
    try {
      // Basic security - only allow from localhost or with admin key
      const adminKey = req.headers['x-admin-key'] as string;
      const isLocalhost = req.ip === '127.0.0.1' || req.ip === '::1' || req.hostname === 'localhost';
      
      if (!isLocalhost && adminKey !== process.env.ADMIN_KEY) {
        return res.status(403).json({ error: "Access denied" });
      }

      const submissions = await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt)).limit(50);
      
      res.json({ 
        success: true,
        submissions: submissions.map(sub => ({
          id: sub.id,
          name: sub.name,
          email: sub.email,
          message: sub.message,
          status: sub.status,
          createdAt: sub.createdAt,
          ipAddress: sub.ipAddress
        }))
      });
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ 
        error: "Failed to fetch contact submissions",
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

  // Sitemap generation endpoint
  app.get("/sitemap.xml", (req, res) => {
    const baseUrl = "https://chennaitrafficcalc.in";
    const lastModified = new Date().toISOString().split('T')[0];
    
    const urls = [
      { path: "/", priority: "1.0", changefreq: "weekly" },
      { path: "/calculator", priority: "0.9", changefreq: "weekly" },
      { path: "/how-it-works", priority: "0.7", changefreq: "monthly" },
      { path: "/methodology", priority: "0.7", changefreq: "monthly" },
      { path: "/data-sources", priority: "0.6", changefreq: "monthly" }
    ];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.path}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    
    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  });

  const httpServer = createServer(app);
  return httpServer;
}