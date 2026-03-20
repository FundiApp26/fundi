import { z } from "zod";

export const createCotisationSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  amount: z.number().int().positive("Le montant doit être positif"),
  periodicity: z.enum(["daily", "2days", "3days", "weekly"]),
  weeklyDay: z.number().int().min(0).max(6).optional(),
  deadlineTime: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:MM"),
  startDate: z.string().optional(),
  memberIds: z.array(z.string().uuid()).optional(),
});

export const initiatePaymentSchema = z.object({
  tourId: z.string().uuid(),
  operator: z.enum(["om", "momo"]),
});

export const manualPaymentSchema = z.object({
  tourId: z.string().uuid(),
  amount: z.number().int().positive().optional(),
  proofUrl: z.string().url().optional(),
});

export const reorderToursSchema = z.object({
  order: z.array(z.object({
    userId: z.string().uuid(),
    tourOrder: z.number().int().positive(),
  })),
});
