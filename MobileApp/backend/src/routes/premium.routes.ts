import { Router, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// POST /api/premium/subscribe — Subscribe (interface: Premium → DEVENIR PREMIUM)
router.post("/subscribe", authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { operator } = req.body;
    const amount = 10000; // 10.000 FCFA/mois

    const tx = await prisma.premiumTransaction.create({
      data: { userId: req.userId!, amount, operator, status: "pending" },
    });

    // TODO: Initiate Dohone payment for premium
    // const dohoneResult = await initiatePayment(user, operator, amount, 'premium');

    res.status(201).json(tx);
  } catch (err) { next(err); }
});

// POST /api/premium/callback — Dohone webhook
router.post("/callback", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { transactionId, status, dohoneRef } = req.body;

    const tx = await prisma.premiumTransaction.update({
      where: { id: transactionId },
      data: { status: status === "success" ? "completed" : "failed", dohoneRef },
    });

    if (status === "success") {
      const premiumUntil = new Date();
      premiumUntil.setMonth(premiumUntil.getMonth() + 1);

      await prisma.user.update({
        where: { id: tx.userId },
        data: { isPremium: true, premiumUntil },
      });
    }

    res.json({ received: true });
  } catch (err) { next(err); }
});

// GET /api/premium/history — Transaction history (interface: Historique)
router.get("/history", authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Combine payment history + premium transactions
    const payments = await prisma.payment.findMany({
      where: { payerId: req.userId, status: { in: ["paid", "pending"] } },
      include: { tour: { include: { cotisation: { select: { name: true } } } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const transactions = payments.map((p) => ({
      id: p.id,
      type: p.isExternal ? "depot" : "cotisation",
      name: p.tour.cotisation.name,
      subtype: p.isExternal ? "Dépôt d'argent" : "Paiement de cotisation",
      amount: p.amount,
      positive: false,
      time: p.paidAt || p.createdAt,
    }));

    res.json(transactions);
  } catch (err) { next(err); }
});

export default router;
