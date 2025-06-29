import { z } from "zod";

export const calculatorFormSchema = z.object({
  transportMode: z.string().min(1, "Please select a transportation mode"),
  vehicleTypeId: z.number().optional(),
  occupancy: z.number().min(1).max(10).default(1),
  origin: z.string().min(1, "Please enter your starting location"),
  destination: z.string().min(1, "Please enter your destination"),
  timing: z.string().min(1, "Please select your travel timing"),
  frequency: z.string().min(1, "Please select how often you travel"),
});

export type CalculatorFormData = z.infer<typeof calculatorFormSchema>;

export const feedbackSchema = z.object({
  calculationId: z.number(),
  rating: z.number().min(1).max(5).optional(),
  helpful: z.boolean().optional(),
  comments: z.string().optional(),
});

export type FeedbackData = z.infer<typeof feedbackSchema>;
