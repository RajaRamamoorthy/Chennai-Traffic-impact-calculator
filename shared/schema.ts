import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table for basic user tracking
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Vehicle types and their emission factors
export const vehicleTypes = pgTable("vehicle_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // car, bike, bus, metro, auto, walking
  emissionFactor: decimal("emission_factor", { precision: 10, scale: 4 }).notNull(), // kg CO2 per km
  fuelCostPerKm: decimal("fuel_cost_per_km", { precision: 10, scale: 4 }).notNull(),
  avgSpeedKmh: integer("avg_speed_kmh").notNull(),
  baseImpactScore: integer("base_impact_score").notNull(), // 0-100
});

// Route calculations and results
export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"),
  transportMode: text("transport_mode").notNull(),
  vehicleTypeId: integer("vehicle_type_id").references(() => vehicleTypes.id),
  occupancy: integer("occupancy").default(1),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  originLat: decimal("origin_lat", { precision: 10, scale: 8 }),
  originLng: decimal("origin_lng", { precision: 11, scale: 8 }),
  destinationLat: decimal("destination_lat", { precision: 10, scale: 8 }),
  destinationLng: decimal("destination_lng", { precision: 11, scale: 8 }),
  distanceKm: decimal("distance_km", { precision: 10, scale: 2 }),
  timing: text("timing").notNull(), // morning-peak, evening-peak, off-peak, night
  frequency: text("frequency").notNull(), // daily, frequent, occasional, rare
  impactScore: integer("impact_score").notNull(),
  breakdown: jsonb("breakdown").notNull(), // detailed score breakdown
  monthlyEmissions: decimal("monthly_emissions", { precision: 10, scale: 2 }),
  monthlyCost: decimal("monthly_cost", { precision: 10, scale: 2 }),
  monthlyTimeHours: decimal("monthly_time_hours", { precision: 10, scale: 2 }),
  alternatives: jsonb("alternatives").notNull(), // alternative suggestions
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Feedback and analytics
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  calculationId: integer("calculation_id").references(() => calculations.id),
  rating: integer("rating"), // 1-5
  helpful: boolean("helpful"),
  comments: text("comments"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Contact submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  status: text("status").default("pending").notNull(), // pending, sent, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Route congestion data for Chennai areas
export const routeCongestion = pgTable("route_congestion", {
  id: serial("id").primaryKey(),
  areaName: text("area_name").notNull(),
  lat: decimal("lat", { precision: 10, scale: 8 }).notNull(),
  lng: decimal("lng", { precision: 11, scale: 8 }).notNull(),
  morningPeakMultiplier: decimal("morning_peak_multiplier", { precision: 4, scale: 2 }).default("1.5"),
  eveningPeakMultiplier: decimal("evening_peak_multiplier", { precision: 4, scale: 2 }).default("1.6"),
  offPeakMultiplier: decimal("off_peak_multiplier", { precision: 4, scale: 2 }).default("1.0"),
  nightMultiplier: decimal("night_multiplier", { precision: 4, scale: 2 }).default("0.8"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  calculations: many(calculations),
}));

export const calculationsRelations = relations(calculations, ({ one, many }) => ({
  user: one(users, {
    fields: [calculations.userId],
    references: [users.id],
  }),
  vehicleType: one(vehicleTypes, {
    fields: [calculations.vehicleTypeId],
    references: [vehicleTypes.id],
  }),
  feedback: many(feedback),
}));

export const vehicleTypesRelations = relations(vehicleTypes, ({ many }) => ({
  calculations: many(calculations),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
  calculation: one(calculations, {
    fields: [feedback.calculationId],
    references: [calculations.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCalculationSchema = createInsertSchema(calculations).omit({
  id: true,
  createdAt: true,
  impactScore: true,
  breakdown: true,
  monthlyEmissions: true,
  monthlyCost: true,
  monthlyTimeHours: true,
  alternatives: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true,
});

export const insertVehicleTypeSchema = createInsertSchema(vehicleTypes).omit({
  id: true,
});

export const insertRouteCongestionSchema = createInsertSchema(routeCongestion).omit({
  id: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof calculations.$inferSelect;

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;

export type InsertVehicleType = z.infer<typeof insertVehicleTypeSchema>;
export type VehicleType = typeof vehicleTypes.$inferSelect;

export type InsertRouteCongestion = z.infer<typeof insertRouteCongestionSchema>;
export type RouteCongestion = typeof routeCongestion.$inferSelect;

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;