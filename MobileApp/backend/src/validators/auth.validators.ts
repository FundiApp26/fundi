import { z } from "zod";

export const sendOtpSchema = z.object({
  phone: z.string().min(10).max(20).regex(/^\+?[0-9]+$/, "Numéro de téléphone invalide"),
});

export const verifyOtpSchema = z.object({
  phone: z.string().min(10).max(20),
  code: z.string().length(6, "Le code doit contenir 6 chiffres"),
});

export const registerSchema = z.object({
  phone: z.string().min(10).max(20),
  firstName: z.string().min(1, "Le nom est requis").max(100),
  lastName: z.string().max(100).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  omNumber: z.string().max(20).optional().nullable(),
  omConfirmName: z.string().max(100).optional().nullable(),
  momoNumber: z.string().max(20).optional().nullable(),
  momoConfirmName: z.string().max(100).optional().nullable(),
  pin: z.string().length(5, "Le PIN doit contenir 5 chiffres").regex(/^[0-9]+$/, "Le PIN ne doit contenir que des chiffres"),
});

export const loginSchema = z.object({
  phone: z.string().min(10).max(20),
  pin: z.string().length(5),
});

export const resetPasswordSchema = z.object({
  phone: z.string().min(10).max(20),
  code: z.string().min(4).max(6),
  newPin: z.string().length(5).regex(/^[0-9]+$/),
});
