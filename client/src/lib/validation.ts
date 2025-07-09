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
  calculationId: z.number().optional(),
  rating: z.number().min(1).max(5).default(5),
  helpful: z.boolean().optional(),
  comments: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(1, "Message is required"),
});

export type FeedbackData = z.infer<typeof feedbackSchema>;
