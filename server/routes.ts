import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { impactCalculator } from "./services/impact-calculator";
import { RoutingService } from "./services/routing-service";
import { insertCalculationSchema, insertFeedbackSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

      if (category && typeof category === 'string') {
        vehicleTypes = await storage.getVehicleTypesByCategory(category);
      } else {
        vehicleTypes = await storage.getVehicleTypes();
      }

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