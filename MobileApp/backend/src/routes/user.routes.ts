// @ts-nocheck
import { Router, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();
router.use(authMiddleware);

// GET /api/users/me — Mon profil (interface: Profil)
router.get("/me", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true, phone: true, firstName: true, lastName: true, avatarUrl: true,
        omNumber: true, omConfirmName: true, momoNumber: true, momoConfirmName: true,
        isPremium: true, premiumUntil: true, monthlySends: true, createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    const stats = await computeUserStats(user.id);
    res.json({ ...user, stats });
  } catch (err) { next(err); }
});

// PUT /api/users/me — Update profile
router.put("/me", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, avatarUrl } = req.body;
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { ...(firstName && { firstName }), ...(lastName !== undefined && { lastName }), ...(avatarUrl !== undefined && { avatarUrl }) },
      select: { id: true, firstName: true, lastName: true, avatarUrl: true },
    });
    res.json(user);
  } catch (err) { next(err); }
});

// PUT /api/users/me/momo — Update OM & MoMo (interface: Mon OM et MoMo)
router.put("/me/momo", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { omNumber, omConfirmName, momoNumber, momoConfirmName } = req.body;
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { omNumber, omConfirmName, momoNumber, momoConfirmName },
      select: { omNumber: true, omConfirmName: true, momoNumber: true, momoConfirmName: true },
    });
    res.json(user);
  } catch (err) { next(err); }
});

// PUT /api/users/me/pin — Change PIN
router.put("/me/pin", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { currentPin, newPin } = req.body;
    if (!currentPin || !newPin) return res.status(400).json({ error: "PINs requis" });
    if (newPin.length !== 5) return res.status(400).json({ error: "Le PIN doit contenir 5 chiffres" });
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    const valid = await bcrypt.compare(currentPin, user.pinHash);
    if (!valid) return res.status(401).json({ error: "PIN actuel incorrect" });
    const pinHash = await bcrypt.hash(newPin, 10);
    await prisma.user.update({ where: { id: req.userId }, data: { pinHash } });
    res.json({ message: "PIN mis à jour" });
  } catch (err) { next(err); }
});

// PUT /api/users/me/fcm — FCM token
router.put("/me/fcm", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.user.update({ where: { id: req.userId }, data: { fcmToken: req.body.fcmToken } });
    res.json({ message: "OK" });
  } catch (err) { next(err); }
});

// GET /api/users/:id — Profil contact (admin/membre)
router.get("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, phone: true, firstName: true, lastName: true, avatarUrl: true, omNumber: true, momoNumber: true, isOnline: true, lastSeenAt: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    const stats = await computeUserStats(id);
    const sharedCotisations = await prisma.cotisationMember.findMany({
      where: { userId: id, cotisation: { members: { some: { userId: req.userId } } } },
      include: { cotisation: { select: { id: true, name: true }, include: { members: { select: { userId: true, role: true } } } } },
    });
    const isAdmin = sharedCotisations.some((cm) => cm.cotisation.members.some((m) => m.userId === req.userId && m.role === "admin"));
    const groupsEnCommun = sharedCotisations.map((cm) => ({ id: cm.cotisation.id, name: cm.cotisation.name, memberCount: cm.cotisation.members.length }));
    res.json({ ...user, stats, isAdmin, groupsEnCommun });
  } catch (err) { next(err); }
});

async function computeUserStats(userId: string) {
  const memberships = await prisma.cotisationMember.findMany({ where: { userId }, include: { cotisation: { select: { status: true, amount: true } } } });
  const total = memberships.length;
  const enCours = memberships.filter((m) => m.cotisation.status === "active").length;
  const succes = memberships.filter((m) => m.cotisation.status === "completed").length;
  const echec = await prisma.payment.count({ where: { payerId: userId, status: "failed" } });
  const amounts = memberships.map((m) => m.cotisation.amount);
  const montantHaut = amounts.length > 0 ? Math.max(...amounts) : 0;
  const montantBas = amounts.length > 0 ? Math.min(...amounts) : 0;
  const cote = Math.max(0, Math.min(20, 20 - echec * 2));
  return { total, enCours, succes, echec, montantHaut, montantBas, cote };
}

export default router;
