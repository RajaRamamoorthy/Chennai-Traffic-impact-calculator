import { 
  users, 
  calculations, 
  vehicleTypes, 
  feedback, 
  routeCongestion,
  contactSubmissions,
  donations,
  type InsertUser, 
  type InsertCalculation, 
  type InsertFeedback,
  type InsertContactSubmission,
  type InsertDonation,
  type Calculation,
  type VehicleType,
  type ContactSubmission,
  type Donation,
  type User,
  type Feedback,
  type RouteCongestion,
  type InsertVehicleType,
  type InsertRouteCongestion
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql, gte, count, sum } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserBySessionId(sessionId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Vehicle Types
  getVehicleTypes(): Promise<VehicleType[]>;
  getVehicleTypesByCategory(category: string): Promise<VehicleType[]>;
  getVehicleType(id: number): Promise<VehicleType | undefined>;
  createVehicleType(vehicleType: InsertVehicleType): Promise<VehicleType>;

  // Calculations
  createCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getCalculation(id: number): Promise<Calculation | undefined>;
  getCalculationsByUser(userId: number): Promise<Calculation[]>;
  getCalculationsBySessionId(sessionId: string): Promise<Calculation[]>;

  // Feedback
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getFeedbackByCalculation(calculationId: number): Promise<Feedback[]>;

  // Route Congestion
  getRouteCongestion(): Promise<RouteCongestion[]>;
  getRouteCongestionByArea(lat: number, lng: number, radiusKm: number): Promise<RouteCongestion[]>;
  createRouteCongestion(congestion: InsertRouteCongestion): Promise<RouteCongestion>;

  // Analytics
  getCalculationStats(): Promise<{totalCalculations: number, avgImpactScore: number}>;
  getHomepageStats(): Promise<{totalCalculations: number, totalCO2SavedKg: number, totalMoneySaved: number}>;

  // Contact Submissions
  createContactSubmission(data: InsertContactSubmission): Promise<ContactSubmission>;
  updateContactSubmissionStatus(id: number, status: string): Promise<void>;
  getRecentContactSubmissions(ipAddress: string, timeWindowMinutes?: number): Promise<ContactSubmission[]>;
  getContactSubmissions(): Promise<ContactSubmission[]>;

  // Donations
  createDonation(data: InsertDonation): Promise<Donation>;
  getDonation(paymentId: string): Promise<Donation | undefined>;
  getDonations(): Promise<Donation[]>;
  getDonationStats(): Promise<{totalDonations: number, totalAmount: number}>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserBySessionId(sessionId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.sessionId, sessionId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Vehicle Types
  async getVehicleTypes(): Promise<VehicleType[]> {
    return await db.select().from(vehicleTypes);
  }

  async getVehicleTypesByCategory(category: string): Promise<VehicleType[]> {
    return await db.select().from(vehicleTypes).where(eq(vehicleTypes.category, category));
  }

  async getVehicleType(id: number): Promise<VehicleType | undefined> {
    const [vehicleType] = await db.select().from(vehicleTypes).where(eq(vehicleTypes.id, id));
    return vehicleType || undefined;
  }

  async createVehicleType(insertVehicleType: InsertVehicleType): Promise<VehicleType> {
    const [vehicleType] = await db
      .insert(vehicleTypes)
      .values(insertVehicleType)
      .returning();
    return vehicleType;
  }

  // Calculations
  async createCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const [calculation] = await db
      .insert(calculations)
      .values(insertCalculation)
      .returning();
    return calculation;
  }

  async getCalculation(id: number): Promise<Calculation | undefined> {
    const [calculation] = await db.select().from(calculations).where(eq(calculations.id, id));
    return calculation || undefined;
  }

  async getCalculationsByUser(userId: number): Promise<Calculation[]> {
    return await db.select().from(calculations).where(eq(calculations.userId, userId));
  }

  async getCalculationsBySessionId(sessionId: string): Promise<Calculation[]> {
    return await db.select().from(calculations).where(eq(calculations.sessionId, sessionId));
  }

  // Feedback
  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const [feedbackRecord] = await db
      .insert(feedback)
      .values(insertFeedback)
      .returning();
    return feedbackRecord;
  }

  async getFeedbackByCalculation(calculationId: number): Promise<Feedback[]> {
    return await db.select().from(feedback).where(eq(feedback.calculationId, calculationId));
  }

  // Route Congestion
  async getRouteCongestion(): Promise<RouteCongestion[]> {
    return await db.select().from(routeCongestion);
  }

  async getRouteCongestionByArea(lat: number, lng: number, radiusKm: number): Promise<RouteCongestion[]> {
    // Use Haversine formula for distance calculation
    // Convert radius from km to degrees (approximate)
    const degreeRadius = radiusKm / 111; // Roughly 111 km per degree at equator

    return await db.select().from(routeCongestion).where(
      sql`(
        (CAST(${routeCongestion.lat} AS DECIMAL) - ${lat})^2 + 
        (CAST(${routeCongestion.lng} AS DECIMAL) - ${lng})^2
      ) < ${degreeRadius * degreeRadius}`
    );
  }

  async createRouteCongestion(insertCongestion: InsertRouteCongestion): Promise<RouteCongestion> {
    const [congestion] = await db
      .insert(routeCongestion)
      .values(insertCongestion)
      .returning();
    return congestion;
  }

  // Analytics
  async getCalculationStats(): Promise<{totalCalculations: number, avgImpactScore: number}> {
    const [stats] = await db
      .select({
        totalCalculations: sql<number>`count(*)`.as('total'),
        avgImpactScore: sql<number>`avg(${calculations.impactScore})`.as('avg_score'),
      })
      .from(calculations);

    return {
      totalCalculations: stats.totalCalculations || 0,
      avgImpactScore: Math.round(stats.avgImpactScore || 0),
    };
  }

  async getHomepageStats(): Promise<{totalCalculations: number, totalCO2SavedKg: number, totalMoneySaved: number}> {
    const [stats] = await db
      .select({
        totalCalculations: sql<number>`count(*)`.as('total'),
        totalMonthlyCO2: sql<number>`sum(CAST(${calculations.monthlyEmissions} AS DECIMAL))`.as('total_co2'),
        totalMonthlySavings: sql<number>`sum(CAST(${calculations.monthlyCost} AS DECIMAL))`.as('total_savings'),
      })
      .from(calculations);

    return {
      totalCalculations: stats.totalCalculations || 0,
      totalCO2SavedKg: Math.round((Number(stats.totalMonthlyCO2) || 0) * 12), // Annual from monthly
      totalMoneySaved: Math.round((Number(stats.totalMonthlySavings) || 0) * 12), // Annual from monthly
    };
  }

  async createContactSubmission(data: InsertContactSubmission): Promise<ContactSubmission> {
    try {
      const [submission] = await db
        .insert(contactSubmissions)
        .values(data)
        .returning();
      return submission;
    } catch (error) {
      console.error("Error creating contact submission:", error);
      throw error;
    }
  }

  async updateContactSubmissionStatus(id: number, status: string): Promise<void> {
    try {
      await db
        .update(contactSubmissions)
        .set({ status })
        .where(eq(contactSubmissions.id, id));
    } catch (error) {
      console.error("Error updating contact submission status:", error);
      throw error;
    }
  }

  async getRecentContactSubmissions(ipAddress: string, timeWindowMinutes: number = 60): Promise<ContactSubmission[]> {
    try {
      const timeThreshold = new Date(Date.now() - (timeWindowMinutes * 60 * 1000));

      return await db
        .select()
        .from(contactSubmissions)
        .where(
          and(
            eq(contactSubmissions.ipAddress, ipAddress),
            gte(contactSubmissions.createdAt, timeThreshold)
          )
        );
    } catch (error) {
      console.error("Error getting recent contact submissions:", error);
      throw error;
    }
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(sql`${contactSubmissions.createdAt} DESC`);
  }

  async createDonation(data: InsertDonation): Promise<Donation> {
    const [donation] = await db.insert(donations).values(data).returning();
    return donation;
  }

  async getDonation(paymentId: string): Promise<Donation | undefined> {
    const [donation] = await db.select().from(donations).where(eq(donations.paymentId, paymentId));
    return donation;
  }

  async getDonations(): Promise<Donation[]> {
    return await db.select().from(donations).orderBy(sql`${donations.createdAt} DESC`);
  }

  async getDonationStats(): Promise<{totalDonations: number, totalAmount: number}> {
    const [stats] = await db
      .select({
        totalDonations: sql<number>`count(*)`.as('total'),
        totalAmount: sql<number>`sum(${donations.amount})`.as('total_amount')
      })
      .from(donations)
      .where(eq(donations.status, 'verified'));
    
    return {
      totalDonations: stats.totalDonations || 0,
      totalAmount: Number(stats.totalAmount) || 0
    };
  }
}

export const storage = new DatabaseStorage();