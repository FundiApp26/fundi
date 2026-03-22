import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { env } from "../config/env";
import { sendOtpSms } from "../services/sms.service";

const router = Router();

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateToken(userId: string, type: "access" | "refresh"): string {
  const secret = type === "access" ? env.JWT_SECRET : env.JWT_REFRESH_SECRET;
  const expiresIn = type === "access" ? "1h" : "30d";
  return jwt.sign({ userId }, secret, { expiresIn });
}

// POST /api/auth/send-otp
// Interface: phone-verify (Vérifiez votre numéro)
router.post("/send-otp", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Le numéro de téléphone est requis" });

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Invalidate previous OTPs for this phone
    await prisma.otpCode.updateMany({
      where: { phone, verified: false },
      data: { verified: true },
    });

    // Store new OTP
    await prisma.otpCode.create({
      data: { phone, code, expiresAt },
    });

    // Send SMS (non-blocking, don't fail if SMS service is down)
    sendOtpSms(phone, code).catch((err) => console.error("[SMS] Failed:", err));

    // In dev mode, include code in response for testing
    const isDev = env.NODE_ENV === "development";
    res.status(200).json({ message: "Code envoyé", expiresIn: 300, ...(isDev && { devCode: code }) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/verify-otp
// Interface: otp-verify (Entrez votre code de vérification)
router.post("/verify-otp", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ error: "Téléphone et code requis" });

    // Dev bypass: code 000000 always works in development
    const isDevBypass = env.NODE_ENV === "development" && code === "000000";

    if (isDevBypass) {
      // Skip DB entirely — just return success
      let existingUser = null;
      try { existingUser = await prisma.user.findUnique({ where: { phone } }); } catch {}
      return res.status(200).json({ verified: true, isNewUser: !existingUser, phone });
    }

    const otp = await prisma.otpCode.findFirst({
      where: { phone, code, verified: false, expiresAt: { gte: new Date() } },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) return res.status(400).json({ error: "Code invalide ou expiré" });

    await prisma.otpCode.update({ where: { id: otp.id }, data: { verified: true } });

    const existingUser = await prisma.user.findUnique({ where: { phone } });

    res.status(200).json({
      verified: true,
      isNewUser: !existingUser,
      phone,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/register
// Interfaces: profile-setup (nom, prénom, photo) + momo-setup (OM, MoMo) + pin-setup (PIN 5 chiffres)
router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, firstName, lastName, avatarUrl, omNumber, omConfirmName, momoNumber, momoConfirmName, pin } = req.body;

    if (!phone || !firstName || !pin) {
      return res.status(400).json({ error: "Téléphone, nom et PIN requis" });
    }

    if (pin.length !== 5) {
      return res.status(400).json({ error: "Le PIN doit contenir 5 chiffres" });
    }

    // Check phone was verified (skip in dev mode)
    if (env.NODE_ENV !== "development") {
      const verifiedOtp = await prisma.otpCode.findFirst({
        where: { phone, verified: true },
        orderBy: { createdAt: "desc" },
      });
      if (!verifiedOtp) {
        return res.status(400).json({ error: "Numéro non vérifié" });
      }
    }

    // Check user doesn't already exist
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      return res.status(409).json({ error: "Ce numéro est déjà enregistré" });
    }

    const pinHash = await bcrypt.hash(pin, 10);

    const user = await prisma.user.create({
      data: {
        phone,
        firstName,
        lastName: lastName || "",
        avatarUrl: avatarUrl || null,
        pinHash,
        omNumber: omNumber || null,
        omConfirmName: omConfirmName || null,
        momoNumber: momoNumber || null,
        momoConfirmName: momoConfirmName || null,
      },
    });

    const accessToken = generateToken(user.id, "access");
    const refreshToken = generateToken(user.id, "refresh");

    res.status(201).json({
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        isPremium: user.isPremium,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
// Interface: pin-login (Entrez votre code PIN)
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, pin } = req.body;
    if (!phone || !pin) return res.status(400).json({ error: "Téléphone et PIN requis" });

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) return res.status(401).json({ error: "Utilisateur non trouvé" });

    const pinValid = await bcrypt.compare(pin, user.pinHash);
    if (!pinValid) return res.status(401).json({ error: "Code PIN incorrect" });

    // Update online status
    await prisma.user.update({
      where: { id: user.id },
      data: { isOnline: true, lastSeenAt: new Date() },
    });

    const accessToken = generateToken(user.id, "access");
    const refreshToken = generateToken(user.id, "refresh");

    res.status(200).json({
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        omNumber: user.omNumber,
        momoNumber: user.momoNumber,
        isPremium: user.isPremium,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/refresh
router.post("/refresh", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "Refresh token requis" });

    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string };

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ error: "Utilisateur non trouvé" });

    const newAccessToken = generateToken(user.id, "access");

    res.status(200).json({ accessToken: newAccessToken });
  } catch {
    res.status(401).json({ error: "Token invalide" });
  }
});

// POST /api/auth/forgot-password
// Interface: forgot-password (Mot de passe oublié → vérification → nouveau PIN)
router.post("/forgot-password", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Téléphone requis" });

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    const code = generateOtp().substring(0, 4); // 4-digit code for forgot password
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.otpCode.create({ data: { phone, code, expiresAt } });
    sendOtpSms(phone, code).catch((err) => console.error("[SMS] Failed:", err));

    const isDev = env.NODE_ENV === "development";
    res.status(200).json({ message: "Code envoyé", ...(isDev && { devCode: code }) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/reset-password
// Interface: forgot-password phase 3 (Nouveau mot de passe → SAUVEGARDER)
router.post("/reset-password", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, code, newPin } = req.body;
    if (!phone || !code || !newPin) return res.status(400).json({ error: "Tous les champs sont requis" });

    if (newPin.length !== 5) return res.status(400).json({ error: "Le PIN doit contenir 5 chiffres" });

    // Dev bypass: code 0000 always works
    const isDevBypass = env.NODE_ENV === "development" && code === "0000";

    if (!isDevBypass) {
      const otp = await prisma.otpCode.findFirst({
        where: { phone, code, verified: false, expiresAt: { gte: new Date() } },
        orderBy: { createdAt: "desc" },
      });
      if (!otp) return res.status(400).json({ error: "Code invalide ou expiré" });
      await prisma.otpCode.update({ where: { id: otp.id }, data: { verified: true } });
    }

    const pinHash = await bcrypt.hash(newPin, 10);
    await prisma.user.update({ where: { phone }, data: { pinHash } });

    res.status(200).json({ message: "PIN mis à jour avec succès" });
  } catch (err) {
    next(err);
  }
});

export default router;
