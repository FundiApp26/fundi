// @ts-nocheck
import { Router, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();
router.use(authMiddleware);

// POST /api/cotisations — Create (interface: Nouvelle cotisation form)
router.post("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, amount, periodicity, weeklyDay, deadlineTime, startDate, memberIds } = req.body;
    if (!name || !amount || !periodicity || !deadlineTime) {
      return res.status(400).json({ error: "Nom, montant, périodicité et heure limite requis" });
    }

    // Check free user limit: max 3 cotisations
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user?.isPremium) {
      const count = await prisma.cotisationMember.count({ where: { userId: req.userId } });
      if (count >= 3) return res.status(403).json({ error: "Limite de 3 cotisations atteinte. Passez en premium." });
    }

    const cotisation = await prisma.cotisation.create({
      data: {
        name, description, amount, periodicity,
        weeklyDay: weeklyDay || null,
        deadlineTime,
        startDate: startDate ? new Date(startDate) : null,
        createdById: req.userId!,
        members: {
          create: [
            { userId: req.userId!, role: "admin", tourOrder: 1 },
            ...(memberIds || []).map((uid: string, i: number) => ({ userId: uid, role: "member", tourOrder: i + 2 })),
          ],
        },
      },
      include: { members: { include: { user: { select: { id: true, firstName: true, lastName: true, phone: true, avatarUrl: true } } } } },
    });

    res.status(201).json(cotisation);
  } catch (err) { next(err); }
});

// GET /api/cotisations — List my cotisations (interface: Home Cotisation)
router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const memberships = await prisma.cotisationMember.findMany({
      where: { userId: req.userId },
      include: {
        cotisation: {
          include: {
            members: { include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } } },
            messages: { orderBy: { createdAt: "desc" }, take: 1, include: { sender: { select: { firstName: true } } } },
          },
        },
      },
      orderBy: { cotisation: { createdAt: "desc" } },
    });

    const list = memberships.map((m) => {
      const lastMsg = m.cotisation.messages[0];
      return {
        id: m.cotisation.id,
        name: m.cotisation.name,
        avatarUrl: m.cotisation.avatarUrl,
        amount: m.cotisation.amount,
        status: m.cotisation.status,
        memberCount: m.cotisation.members.length,
        myRole: m.role,
        lastMessage: lastMsg ? { text: lastMsg.content, sender: lastMsg.sender.firstName, time: lastMsg.createdAt } : null,
      };
    });

    res.json(list);
  } catch (err) { next(err); }
});

// GET /api/cotisations/:id — Detail (interface: Profil cotisation)
router.get("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cotisation = await prisma.cotisation.findUnique({
      where: { id: req.params.id },
      include: {
        members: { include: { user: { select: { id: true, firstName: true, lastName: true, phone: true, avatarUrl: true } } }, orderBy: { tourOrder: "asc" } },
        tours: { orderBy: { tourNumber: "asc" }, include: { beneficiary: { select: { id: true, firstName: true, lastName: true } } } },
        createdBy: { select: { id: true, firstName: true } },
      },
    });
    if (!cotisation) return res.status(404).json({ error: "Cotisation non trouvée" });
    res.json(cotisation);
  } catch (err) { next(err); }
});

// PUT /api/cotisations/:id — Update (admin only)
router.put("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const member = await prisma.cotisationMember.findFirst({ where: { cotisationId: req.params.id, userId: req.userId, role: "admin" } });
    if (!member) return res.status(403).json({ error: "Admin requis" });

    const { name, description, avatarUrl, status } = req.body;
    const cotisation = await prisma.cotisation.update({
      where: { id: req.params.id },
      data: { ...(name && { name }), ...(description !== undefined && { description }), ...(avatarUrl !== undefined && { avatarUrl }), ...(status && { status }) },
    });
    res.json(cotisation);
  } catch (err) { next(err); }
});

// POST /api/cotisations/:id/members — Add member
router.post("/:id/members", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const member = await prisma.cotisationMember.findFirst({ where: { cotisationId: req.params.id, userId: req.userId, role: "admin" } });
    if (!member) return res.status(403).json({ error: "Admin requis" });

    const { userId } = req.body;
    const maxOrder = await prisma.cotisationMember.aggregate({ where: { cotisationId: req.params.id }, _max: { tourOrder: true } });
    const newMember = await prisma.cotisationMember.create({
      data: { cotisationId: req.params.id, userId, tourOrder: (maxOrder._max.tourOrder || 0) + 1 },
      include: { user: { select: { id: true, firstName: true, lastName: true, phone: true, avatarUrl: true } } },
    });
    res.status(201).json(newMember);
  } catch (err) { next(err); }
});

// DELETE /api/cotisations/:id/members/:uid — Remove member
router.delete("/:id/members/:uid", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const isAdmin = await prisma.cotisationMember.findFirst({ where: { cotisationId: req.params.id, userId: req.userId, role: "admin" } });
    const isSelf = req.params.uid === req.userId;
    if (!isAdmin && !isSelf) return res.status(403).json({ error: "Non autorisé" });

    await prisma.cotisationMember.deleteMany({ where: { cotisationId: req.params.id, userId: req.params.uid } });
    res.json({ message: "Membre retiré" });
  } catch (err) { next(err); }
});

// PUT /api/cotisations/:id/tours/reorder — Reorder tours (interface: Liste des membres drag)
router.put("/:id/tours/reorder", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const isAdmin = await prisma.cotisationMember.findFirst({ where: { cotisationId: req.params.id, userId: req.userId, role: "admin" } });
    if (!isAdmin) return res.status(403).json({ error: "Admin requis" });

    const { order } = req.body; // [{userId, tourOrder}]
    for (const item of order) {
      await prisma.cotisationMember.updateMany({
        where: { cotisationId: req.params.id, userId: item.userId },
        data: { tourOrder: item.tourOrder },
      });
    }
    res.json({ message: "Ordre mis à jour" });
  } catch (err) { next(err); }
});

// GET /api/cotisations/:id/tours — List tours (interface: Historique de tours)
router.get("/:id/tours", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tours = await prisma.tour.findMany({
      where: { cotisationId: req.params.id },
      include: {
        beneficiary: { select: { id: true, firstName: true, lastName: true } },
        payments: { include: { payer: { select: { id: true, firstName: true, lastName: true, phone: true } } } },
      },
      orderBy: { tourNumber: "asc" },
    });
    res.json(tours);
  } catch (err) { next(err); }
});

// GET /api/cotisations/:id/tours/:tid/payments — Payments for a tour (interface: La liste de suivi des paiements)
router.get("/:id/tours/:tid/payments", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { tourId: req.params.tid },
      include: { payer: { select: { id: true, firstName: true, lastName: true, phone: true, avatarUrl: true } } },
      orderBy: { createdAt: "asc" },
    });
    res.json(payments);
  } catch (err) { next(err); }
});

// POST /api/cotisations/:id/payments/initiate — Initiate payment via Dohone (interface: Pop-up cotiser)
router.post("/:id/payments/initiate", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { tourId, operator } = req.body;
    if (!tourId || !operator) return res.status(400).json({ error: "Tour et opérateur requis" });

    // Check free limit
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user?.isPremium && (user?.monthlySends || 0) >= 15) {
      return res.status(403).json({ error: "Limite de 15 envois/mois atteinte. Passez en premium." });
    }

    const tour = await prisma.tour.findUnique({ where: { id: tourId }, include: { cotisation: true } });
    if (!tour) return res.status(404).json({ error: "Tour non trouvé" });

    const payment = await prisma.payment.create({
      data: { tourId, payerId: req.userId!, amount: tour.cotisation.amount, operator, status: "pending" },
    });

    // Increment monthly sends
    await prisma.user.update({ where: { id: req.userId }, data: { monthlySends: { increment: 1 } } });

    // TODO: Call Dohone API to initiate actual payment
    // const dohoneResult = await initiatePayment(user, operator, amount);

    res.status(201).json(payment);
  } catch (err) { next(err); }
});

// POST /api/cotisations/:id/payments/manual — Declare manual payment (interface: Dépôt externe)
router.post("/:id/payments/manual", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { tourId, amount, proofUrl } = req.body;
    if (!tourId) return res.status(400).json({ error: "Tour requis" });

    const tour = await prisma.tour.findUnique({ where: { id: tourId }, include: { cotisation: true } });
    if (!tour) return res.status(404).json({ error: "Tour non trouvé" });

    const payment = await prisma.payment.create({
      data: {
        tourId, payerId: req.userId!, amount: amount || tour.cotisation.amount,
        status: "pending", isExternal: true, proofUrl: proofUrl || null,
      },
    });

    res.status(201).json(payment);
  } catch (err) { next(err); }
});

// PUT /api/cotisations/:id/payments/:pid/confirm — Beneficiary confirms manual payment
router.put("/:id/payments/:pid/confirm", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const payment = await prisma.payment.update({
      where: { id: req.params.pid },
      data: { status: "paid", confirmedById: req.userId, paidAt: new Date() },
    });
    res.json(payment);
  } catch (err) { next(err); }
});

export default router;
