// @ts-nocheck
import { Router, Response, NextFunction } from "express";
import { randomBytes } from "crypto";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();
router.use(authMiddleware);

// POST /api/invitations/generate — Generate invite link for cotisation
router.post("/generate", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { cotisationId } = req.body;
    const token = randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await prisma.invitation.create({
      data: { cotisationId, token, createdById: req.userId!, expiresAt },
    });

    res.status(201).json({ token: invitation.token, link: `https://fundi-app.com/join/${invitation.token}` });
  } catch (err) { next(err); }
});

// POST /api/invitations/:token/join — Join cotisation via link
router.post("/:token/join", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const invitation = await prisma.invitation.findUnique({ where: { token: req.params.token } });
    if (!invitation || (invitation.expiresAt && invitation.expiresAt < new Date())) {
      return res.status(400).json({ error: "Invitation invalide ou expirée" });
    }

    const existing = await prisma.cotisationMember.findUnique({
      where: { cotisationId_userId: { cotisationId: invitation.cotisationId, userId: req.userId! } },
    });
    if (existing) return res.status(409).json({ error: "Déjà membre de cette cotisation" });

    const maxOrder = await prisma.cotisationMember.aggregate({ where: { cotisationId: invitation.cotisationId }, _max: { tourOrder: true } });
    const member = await prisma.cotisationMember.create({
      data: { cotisationId: invitation.cotisationId, userId: req.userId!, tourOrder: (maxOrder._max.tourOrder || 0) + 1 },
    });

    res.status(201).json(member);
  } catch (err) { next(err); }
});

export default router;
