import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import { storage } from "./storage";
import { impactCalculator } from "./services/impact-calculator";
import { RoutingService } from "./services/routing-service";
import { emailService } from "./services/email-service";
import { insertCalculationSchema, insertFeedbackSchema, insertContactSubmissionSchema, contactSubmissions, calculations, donations } from "@shared/schema";
import { z } from "zod";
import { desc, sql } from "drizzle-orm";
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

  // Rate limiting for payment verification endpoint (CRITICAL SECURITY)
  const paymentVerificationLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 payment verification attempts per 15 minutes
    message: {
      error: "Too many payment verification attempts. Please try again later.",
      retryAfter: "15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    keyGenerator: (req) => req.ip + ':payment-verification'
  });

  // Rate limiting for Razorpay webhook endpoint
  const webhookRateLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 50, // Allow up to 50 webhook calls per minute
    message: {
      error: "Webhook rate limit exceeded",
      retryAfter: "1 minute"
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip + ':webhook'
  });

  // Rate limiting for Google Maps API endpoints
  const mapsAutocompleteLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per minute
    message: {
      error: "Too many autocomplete requests. Please slow down your typing.",
      retryAfter: "1 minute"
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    keyGenerator: (req) => req.ip + ':autocomplete'
  });

  const mapsGeocodingLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // limit each IP to 20 geocoding requests per minute
    message: {
      error: "Too many location requests. Please wait a moment before trying again.",
      retryAfter: "1 minute"
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip + ':geocoding'
  });

  const mapsDirectionsLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 route calculations per minute
    message: {
      error: "Too many route calculations. Please wait before calculating another route.",
      retryAfter: "1 minute"
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip + ':directions'
  });

  // Rate limiting for calculator endpoints (SECURITY PROTECTION)
  const calculatorLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 15, // limit each IP to 15 calculations per minute
    message: {
      error: "Too many calculations. Please wait a moment before trying again.",
      retryAfter: "1 minute"
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    keyGenerator: (req) => req.ip + ':calculator'
  });

  // Rate limiting for feedback endpoints (SECURITY PROTECTION)
  const feedbackLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 feedback submissions per minute
    message: {
      error: "Too many feedback submissions. Please wait before submitting again.",
      retryAfter: "1 minute"
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    keyGenerator: (req) => req.ip + ':feedback'
  });

  // Rate limiting for dashboard endpoints (SECURITY PROTECTION)
  const dashboardLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // limit each IP to 30 dashboard requests per minute
    message: {
      error: "Too many dashboard requests. Please wait a moment before refreshing.",
      retryAfter: "1 minute"
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    keyGenerator: (req) => req.ip + ':dashboard'
  });

  // General API rate limiting for other endpoints (SECURITY PROTECTION)
  const generalApiLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 50, // limit each IP to 50 general API requests per minute
    message: {
      error: "Too many API requests. Please slow down.",
      retryAfter: "1 minute"
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    keyGenerator: (req) => req.ip + ':general-api'
  });

  // In-memory cache for Google Maps API responses
  const apiCache = new Map<string, { data: any; timestamp: number }>();
  const CACHE_DURATION = {
    autocomplete: 24 * 60 * 60 * 1000, // 24 hours
    geocoding: 7 * 24 * 60 * 60 * 1000, // 7 days
    directions: 60 * 60 * 1000 // 1 hour
  };

  // API usage monitoring
  const apiUsageStats = {
    autocomplete: { calls: 0, cacheHits: 0 },
    geocoding: { calls: 0, cacheHits: 0 },
    directions: { calls: 0, cacheHits: 0 },
    lastReset: new Date()
  };

  // Reset usage stats daily
  setInterval(() => {
    console.log('Google Maps API usage for the day:', {
      autocomplete: apiUsageStats.autocomplete,
      geocoding: apiUsageStats.geocoding,
      directions: apiUsageStats.directions,
      totalAPICalls: apiUsageStats.autocomplete.calls + apiUsageStats.geocoding.calls + apiUsageStats.directions.calls,
      totalCacheHits: apiUsageStats.autocomplete.cacheHits + apiUsageStats.geocoding.cacheHits + apiUsageStats.directions.cacheHits
    });

    // Reset stats
    apiUsageStats.autocomplete = { calls: 0, cacheHits: 0 };
    apiUsageStats.geocoding = { calls: 0, cacheHits: 0 };
    apiUsageStats.directions = { calls: 0, cacheHits: 0 };
    apiUsageStats.lastReset = new Date();
  }, 24 * 60 * 60 * 1000); // 24 hours

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

  // Rate limiter for new stats endpoints
  const rateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // limit each IP to 20 requests per minute
    message: {
      error: "Too many requests. Please wait a moment before trying again.",
      retryAfter: "1 minute"
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip + ':stats'
  });

  // Homepage stats endpoint
  app.get('/api/stats/homepage', rateLimiter, async (req, res) => {
    try {
      const stats = await storage.getHomepageStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching homepage stats:', error);
      res.status(500).json({ error: 'Failed to fetch homepage stats' });
    }
  });

  // Get vehicle types (with rate limiting)
  app.get("/api/vehicle-types", generalApiLimit, async (req, res) => {
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

  // Geocoding endpoint with rate limiting and caching
  app.post("/api/geocode", mapsGeocodingLimit, async (req, res) => {
    try {
      const { address } = req.body;

      if (!address || typeof address !== 'string') {
        return res.status(400).json({ error: "Address is required" });
      }

      // Check cache first
      const cacheKey = `geocode:${address.toLowerCase().trim()}`;
      const cached = apiCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_DURATION.geocoding) {
        console.log(`Cache hit for geocoding: ${address}`);
        apiUsageStats.geocoding.cacheHits++;
        return res.json(cached.data);
      }

      // Track API call
      apiUsageStats.geocoding.calls++;

      const location = await RoutingService.geocodeAddress(address);

      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }

      // Cache the result
      apiCache.set(cacheKey, { data: location, timestamp: Date.now() });

      res.json(location);
    } catch (error) {
      console.error("Geocoding error:", error);
      res.status(500).json({ 
        error: "Geocoding failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Route information endpoint with rate limiting and caching
  app.post("/api/route-info", mapsDirectionsLimit, async (req, res) => {
    try {
      const { origin, destination } = req.body;

      if (!origin || !destination) {
        return res.status(400).json({ error: "Origin and destination are required" });
      }

      // Check cache first
      const cacheKey = `route:${origin.toLowerCase().trim()}:${destination.toLowerCase().trim()}`;
      const cached = apiCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_DURATION.directions) {
        console.log(`Cache hit for route: ${origin} to ${destination}`);
        apiUsageStats.directions.cacheHits++;
        return res.json(cached.data);
      }

      // Track API call
      apiUsageStats.directions.calls++;

      const routeInfo = await RoutingService.getRouteInfo(origin, destination);

      if (!routeInfo) {
        return res.status(404).json({ error: "Route not found" });
      }

      // Cache the result
      apiCache.set(cacheKey, { data: routeInfo, timestamp: Date.now() });

      res.json(routeInfo);
    } catch (error) {
      console.error("Route info error:", error);
      res.status(500).json({ 
        error: "Failed to get route information",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Place autocomplete endpoint with rate limiting
  app.get("/api/places/autocomplete", mapsAutocompleteLimit, async (req, res) => {
    try {
      const { input } = req.query;

      if (!input || typeof input !== 'string') {
        return res.status(400).json({ error: "Input query is required" });
      }

      // Validate input length to prevent excessive API calls
      if (input.trim().length < 3) {
        return res.json([]); // Return empty results for very short queries
      }

      // Check cache first
      const cacheKey = `autocomplete:${input.toLowerCase().trim()}`;
      const cached = apiCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_DURATION.autocomplete) {
        console.log(`Cache hit for autocomplete: ${input}`);
        apiUsageStats.autocomplete.cacheHits++;
        return res.json(cached.data);
      }

      // Track API call
      apiUsageStats.autocomplete.calls++;

      const predictions = await RoutingService.getPlaceAutocomplete(input);

      // Cache the result
      apiCache.set(cacheKey, { data: predictions, timestamp: Date.now() });

      res.json(predictions);
    } catch (error) {
      console.error("Autocomplete error:", error);
      res.status(500).json({ 
        error: "Autocomplete failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Calculate traffic impact (with rate limiting)
  app.post("/api/calculate-impact", calculatorLimit, async (req, res) => {
    try {
      // Create input-only validation schema (exclude output fields)
      const calculationInputSchema = z.object({
        transportMode: z.string(),
        vehicleTypeId: z.number().optional(),
        occupancy: z.number().int().min(1).default(1),
        origin: z.string(),
        destination: z.string(),
        distanceKm: z.number().positive(),
        travelPattern: z.string()
      });

      // Validate input
      const calculationInput = calculationInputSchema.parse(req.body);

      // Get session ID from headers or generate one
      const sessionId = req.headers['x-session-id'] as string || `session_${Date.now()}_${Math.random()}`;

      // Calculate impact
      const result = await impactCalculator.calculate({
        transportMode: calculationInput.transportMode,
        vehicleTypeId: calculationInput.vehicleTypeId,
        occupancy: calculationInput.occupancy,
        distanceKm: calculationInput.distanceKm,
        travelPattern: calculationInput.travelPattern,
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

  // Submit feedback (with rate limiting)
  app.post("/api/feedback", feedbackLimit, async (req, res) => {
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

  // Get Razorpay config for frontend (only public key)
  app.get("/api/razorpay-config", (req, res) => {
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;

    if (!razorpayKeyId) {
      return res.status(500).json({ error: "Razorpay configuration missing" });
    }

    res.json({ keyId: razorpayKeyId });
  });

  // Get Razorpay payment button config for frontend
  app.get("/api/razorpay-button-config", (req, res) => {
    const paymentButtonId = process.env.RAZORPAY_PAYMENT_BUTTON_ID;

    if (!paymentButtonId) {
      return res.status(500).json({ error: "Payment button configuration missing" });
    }

    res.json({ paymentButtonId });
  });

  // Razorpay webhook handler for server-to-server payment confirmations  
  app.post("/api/razorpay/webhook", webhookRateLimit, express.text({type: 'application/json', limit: '10mb'}), async (req, res) => {
    try {
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      
      if (!webhookSecret) {
        console.error("Razorpay webhook secret not configured");
        return res.status(500).json({ error: "Webhook not configured" });
      }

      // Verify webhook signature using text body
      const shasum = crypto.createHmac('sha256', webhookSecret);
      shasum.update(req.body);
      const digest = shasum.digest('hex');

      const signature = req.headers['x-razorpay-signature'];

      if (digest !== signature) {
        console.error('Webhook signature verification failed');
        console.error('Expected:', digest);
        console.error('Received:', signature);
        console.error('Body:', req.body);
        return res.status(400).json({ error: "Invalid signature" });
      }

      // Parse the JSON body after signature verification
      const webhookData = JSON.parse(req.body);
      const { event, payload } = webhookData;

      if (event === 'payment.captured') {
        const payment = payload.payment.entity;
        
        // Store webhook-verified payment
        const donationData = {
          paymentId: payment.id,
          orderId: payment.order_id || null,
          amount: payment.amount,
          currency: payment.currency,
          status: 'webhook_verified',
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || null
        };

        // Check if payment already exists
        const existingDonation = await storage.getDonation(payment.id);
        if (!existingDonation) {
          await storage.createDonation(donationData);
          
          console.log('=== WEBHOOK DONATION VERIFIED ===');
          console.log('Payment ID:', payment.id);
          console.log('Amount:', payment.amount / 100, 'INR');
          console.log('Event:', event);
          console.log('================================');
        }
      }

      res.json({ status: "ok" });
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  // Verify payment signature (with enhanced security)
  app.post("/api/verify-payment", paymentVerificationLimit, async (req, res) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount } = req.body;

      if (!razorpay_payment_id || !amount) {
        return res.status(400).json({ 
          success: false, 
          error: "Missing required payment verification data" 
        });
      }

      // Enhanced input validation and sanitization
      if (typeof amount !== 'number' || amount < 100 || amount > 10000000) {
        console.warn('Invalid payment amount attempt:', { amount, ip: req.ip });
        return res.status(400).json({ 
          success: false, 
          error: "Invalid payment amount" 
        });
      }

      // Validate payment ID format (Razorpay IDs are alphanumeric)
      if (!/^pay_[A-Za-z0-9]+$/.test(razorpay_payment_id)) {
        console.warn('Invalid payment ID format attempt:', { razorpay_payment_id, ip: req.ip });
        return res.status(400).json({ 
          success: false, 
          error: "Invalid payment ID format" 
        });
      }

      // Additional fraud detection checks
      const suspiciousActivity = {
        rapidRequests: false,
        unusualAmount: false,
        duplicateAttempt: false
      };

      // Check for unusual payment amounts
      if (amount > 5000000) { // More than ₹50,000
        suspiciousActivity.unusualAmount = true;
        console.warn('High-value payment detected:', { 
          paymentId: razorpay_payment_id, 
          amount: amount / 100, 
          ip: req.ip 
        });
      }

      const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!razorpaySecret) {
        console.error("Razorpay secret key not configured");
        return res.status(500).json({ 
          success: false, 
          error: "Payment verification not configured" 
        });
      }

      // Check if donation already exists
      const existingDonation = await storage.getDonation(razorpay_payment_id);
      if (existingDonation) {
        return res.json({ 
          success: true, 
          message: "Payment already verified",
          paymentId: razorpay_payment_id
        });
      }

      // Enhanced signature verification for different payment types
      let signatureVerified = false;
      
      if (razorpay_signature && razorpay_order_id) {
        // Order-based payment signature verification
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
          .createHmac('sha256', razorpaySecret)
          .update(body.toString())
          .digest('hex');

        signatureVerified = expectedSignature === razorpay_signature;

        if (!signatureVerified) {
          console.error('Order payment signature verification failed');
          console.error('Expected:', expectedSignature);
          console.error('Received:', razorpay_signature);

          return res.status(400).json({ 
            success: false, 
            error: "Payment signature verification failed" 
          });
        }
      } else {
        // For payment button or custom payments without order, log for manual review
        console.warn('Payment without signature verification:', {
          paymentId: razorpay_payment_id,
          amount: amount / 100,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date().toISOString()
        });
        
        // Set flag for enhanced monitoring
        signatureVerified = false;
      }

      // Store donation in database with enhanced security status
      const donationData = {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id || null,
        amount: amount,
        currency: 'INR',
        status: signatureVerified ? 'signature_verified' : 'frontend_verified',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || null
      };

      await storage.createDonation(donationData);

      // Log successful donation for audit trail
      console.log('=== DONATION RECEIVED ===');
      console.log('Payment ID:', razorpay_payment_id);
      console.log('Order ID:', razorpay_order_id);
      console.log('Amount:', amount / 100, 'INR');
      console.log('Timestamp:', new Date().toISOString());
      console.log('IP Address:', req.ip);
      console.log('User Agent:', req.get('User-Agent'));
      console.log('========================');

      res.json({ 
        success: true, 
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id
      });
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Payment verification failed" 
      });
    }
  });

  // Get API usage statistics (admin only)
  app.get("/api/admin/api-usage", async (req, res) => {
    try {
      // Basic security check
      const adminKey = req.headers['x-admin-key'];
      if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const totalAPICalls = apiUsageStats.autocomplete.calls + apiUsageStats.geocoding.calls + apiUsageStats.directions.calls;
      const totalCacheHits = apiUsageStats.autocomplete.cacheHits + apiUsageStats.geocoding.cacheHits + apiUsageStats.directions.cacheHits;
      const cacheHitRate = totalAPICalls + totalCacheHits > 0 
        ? (totalCacheHits / (totalAPICalls + totalCacheHits) * 100).toFixed(2) 
        : 0;

      res.json({
        usage: apiUsageStats,
        summary: {
          totalAPICalls,
          totalCacheHits,
          cacheHitRate: `${cacheHitRate}%`,
          lastReset: apiUsageStats.lastReset,
          uptime: new Date().getTime() - apiUsageStats.lastReset.getTime()
        },
        estimatedCosts: {
          autocomplete: `$${(apiUsageStats.autocomplete.calls * 0.00283).toFixed(2)}`,
          geocoding: `$${(apiUsageStats.geocoding.calls * 0.005).toFixed(2)}`,
          directions: `$${(apiUsageStats.directions.calls * 0.005).toFixed(2)}`,
          total: `$${((apiUsageStats.autocomplete.calls * 0.00283) + 
                      (apiUsageStats.geocoding.calls * 0.005) + 
                      (apiUsageStats.directions.calls * 0.005)).toFixed(2)}`
        }
      });
    } catch (error) {
      console.error("API usage stats error:", error);
      res.status(500).json({ error: "Failed to get API usage stats" });
    }
  });

  // Get donation statistics (admin only)
  app.get("/api/admin/donations", async (req, res) => {
    try {
      // Basic security check - you could implement proper admin authentication
      const adminKey = req.headers['x-admin-key'];
      if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const stats = await storage.getDonationStats();
      const donations = await storage.getDonations();

      res.json({
        stats,
        donations: donations.map(d => ({
          id: d.id,
          amount: d.amount,
          currency: d.currency,
          status: d.status,
          createdAt: d.createdAt
        }))
      });
    } catch (error) {
      console.error("Donation stats error:", error);
      res.status(500).json({ error: "Failed to get donation stats" });
    }
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

  // Admin Dashboard APIs
  app.get("/api/admin/dashboard-stats", async (req, res) => {
    try {
      const adminKey = req.headers['x-admin-key'] as string;
      if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const stats = await storage.getAdminDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Admin dashboard stats error:", error);
      res.status(500).json({ error: "Failed to get admin dashboard stats" });
    }
  });

  app.get("/api/admin/top-routes", async (req, res) => {
    try {
      const adminKey = req.headers['x-admin-key'] as string;
      if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const limit = parseInt(req.query.limit as string) || 10;
      const routes = await storage.getTopRoutes(limit);
      res.json(routes);
    } catch (error) {
      console.error("Top routes error:", error);
      res.status(500).json({ error: "Failed to get top routes" });
    }
  });

  app.get("/api/admin/vehicle-usage", async (req, res) => {
    try {
      const adminKey = req.headers['x-admin-key'] as string;
      if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const stats = await storage.getVehicleUsageStats();
      res.json(stats);
    } catch (error) {
      console.error("Vehicle usage error:", error);
      res.status(500).json({ error: "Failed to get vehicle usage stats" });
    }
  });

  app.get("/api/admin/travel-patterns", async (req, res) => {
    try {
      const adminKey = req.headers['x-admin-key'] as string;
      if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const stats = await storage.getTravelPatternStats();
      res.json(stats);
    } catch (error) {
      console.error("Travel patterns error:", error);
      res.status(500).json({ error: "Failed to get travel pattern stats" });
    }
  });

  app.get("/api/admin/score-distribution", async (req, res) => {
    try {
      const adminKey = req.headers['x-admin-key'] as string;
      if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const distribution = await storage.getScoreDistribution();
      res.json(distribution);
    } catch (error) {
      console.error("Score distribution error:", error);
      res.status(500).json({ error: "Failed to get score distribution" });
    }
  });

  app.get("/api/admin/recent-calculations", async (req, res) => {
    try {
      const adminKey = req.headers['x-admin-key'] as string;
      if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const limit = parseInt(req.query.limit as string) || 20;
      const calculations = await storage.getRecentCalculations(limit);
      res.json(calculations);
    } catch (error) {
      console.error("Recent calculations error:", error);
      res.status(500).json({ error: "Failed to get recent calculations" });
    }
  });

  app.get("/api/admin/daily-trends", async (req, res) => {
    try {
      const adminKey = req.headers['x-admin-key'] as string;
      if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const days = parseInt(req.query.days as string) || 7;
      const trends = await storage.getDailyCalculationTrends(days);
      res.json(trends);
    } catch (error) {
      console.error("Daily trends error:", error);
      res.status(500).json({ error: "Failed to get daily trends" });
    }
  });

  // Get user's previous calculations (with rate limiting)
  app.get("/api/calculations", generalApiLimit, async (req, res) => {
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

  // Dashboard API endpoints (with rate limiting)
  app.get("/api/dashboard/commute-insights", dashboardLimit, async (req, res) => {
    try {
      const stats = await storage.getCalculationStats();
      const totalCalculations = await storage.getHomepageStats();

      // Calculate average distance using SQL aggregation to handle decimal properly
      const avgDistanceQuery = await db
        .select({
          avgDistance: sql<number>`avg(CAST(${calculations.distanceKm} AS DECIMAL))`.as('avg_distance')
        })
        .from(calculations)
        .where(sql`${calculations.distanceKm} IS NOT NULL AND CAST(${calculations.distanceKm} AS DECIMAL) > 0`);
      
      const avgDistance = Number(avgDistanceQuery[0]?.avgDistance) || 0;

      const response = {
        averageScore: stats.avgImpactScore,
        averageDistance: avgDistance,
        totalCalculations: totalCalculations.totalCalculations
      };

      res.json(response);
    } catch (error) {
      console.error("Dashboard commute insights error:", error);
      res.status(500).json({ error: "Failed to get commute insights" });
    }
  });

  app.get("/api/dashboard/financial-insights", dashboardLimit, async (req, res) => {
    try {
      const financialData = await storage.getFinancialInsights();
      res.json(financialData);
    } catch (error) {
      console.error("Dashboard financial insights error:", error);
      res.status(500).json({ error: "Failed to get financial insights" });
    }
  });

  app.get("/api/dashboard/traffic-insights", dashboardLimit, async (req, res) => {
    try {
      // Get mode from query parameter (calculator or holistic)
      const mode = req.query.mode as 'calculator' | 'holistic' || 'calculator';
      
      // Validate mode parameter
      if (mode !== 'calculator' && mode !== 'holistic') {
        return res.status(400).json({ error: "Invalid mode. Use 'calculator' or 'holistic'" });
      }

      // This will fetch real-time traffic data from Google Maps
      const trafficService = new (await import('./services/traffic-service')).TrafficService();
      const trafficData = await trafficService.getChennaiTrafficData(mode);
      res.json(trafficData);
    } catch (error) {
      console.error("Dashboard traffic insights error:", error);
      res.status(500).json({ error: "Failed to get traffic insights" });
    }
  });

  app.get("/api/dashboard/weather", dashboardLimit, async (req, res) => {
    try {
      // This will fetch Chennai weather from IMD API
      const weatherService = new (await import('./services/weather-service')).WeatherService();
      const weatherData = await weatherService.getChennaiWeather();
      res.json(weatherData);
    } catch (error) {
      console.error("Dashboard weather error:", error);
      res.status(500).json({ error: "Failed to get weather data" });
    }
  });

  app.get("/api/dashboard/weather-impact", dashboardLimit, async (req, res) => {
    try {
      const weatherService = new (await import('./services/weather-service')).WeatherService();
      const weatherImpactService = new (await import('./services/weather-impact-service')).WeatherImpactService();
      
      const weatherData = await weatherService.getChennaiWeather();
      const impactAnalysis = weatherImpactService.analyzeWeatherImpact(weatherData);
      
      res.json(impactAnalysis);
    } catch (error) {
      console.error("Weather impact analysis error:", error);
      res.status(500).json({ error: "Failed to analyze weather impact" });
    }
  });

  // Sitemap generation endpoint
  app.get("/sitemap.xml", (req, res) => {
    const baseUrl = "https://chennaitrafficcalc.in";
    const lastModified = new Date().toISOString().split('T')[0];

    const urls = [
      { path: "/", priority: "1.0", changefreq: "weekly" },
      { path: "/calculator", priority: "0.9", changefreq: "weekly" },
      { path: "/dashboard", priority: "0.8", changefreq: "daily" },
      { path: "/how-it-works", priority: "0.7", changefreq: "monthly" },
      { path: "/methodology", priority: "0.7", changefreq: "monthly" },
      { path: "/data-sources", priority: "0.6", changefreq: "monthly" },
      { path: "/about-me", priority: "0.8", changefreq: "monthly" },
      { path: "/support", priority: "0.6", changefreq: "monthly" },
      { path: "/faq", priority: "0.8", changefreq: "monthly" },
      { path: "/privacy-policy", priority: "0.5", changefreq: "yearly" },
      { path: "/terms-conditions", priority: "0.5", changefreq: "yearly" },
      { path: "/thank-you", priority: "0.4", changefreq: "yearly" }
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

  // Potential savings stats endpoint
  app.get('/api/stats/potential-savings', rateLimiter, async (req, res) => {
    try {
      const stats = await storage.getPotentialSavingsStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching potential savings stats:', error);
      res.status(500).json({ error: 'Failed to fetch potential savings stats' });
    }
  });

  // Cache clearing endpoint (admin only)
  app.post("/api/admin/clear-cache", async (req, res) => {
    try {
      const adminKey = req.headers['x-admin-key'] as string;
      if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Clear traffic service cache
      const { TrafficService } = await import('./services/traffic-service');
      if (TrafficService.clearCache) {
        TrafficService.clearCache();
      }

      // Clear weather service cache
      const { WeatherService } = await import('./services/weather-service');
      if (WeatherService.clearCache) {
        WeatherService.clearCache();
      }

      // Clear Google Maps API cache
      apiCache.clear();
      
      console.log('🧹 All server caches cleared successfully');
      res.json({ 
        success: true, 
        message: "All caches cleared successfully",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Cache clearing error:", error);
      res.status(500).json({ error: "Failed to clear cache" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}