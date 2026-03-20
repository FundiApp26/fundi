// @ts-nocheck
import { Router, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();
router.use(authMiddleware);

// GET /api/cotisations/:id/messages — Get cotisation group messages (interface: Chat groupe)
router.get("/cotisation/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cursor = req.query.cursor as string | undefined;
    const messages = await prisma.message.findMany({
      where: { cotisationId: req.params.id },
      include: { sender: { select: { id: true, firstName: true, lastName: true, phone: true, avatarUrl: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
    });
    res.json(messages.reverse());
  } catch (err) { next(err); }
});

// POST /api/messages/cotisation/:id — Send message in cotisation group
router.post("/cotisation/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { content, mediaUrl, messageType } = req.body;
    const message = await prisma.message.create({
      data: {
        conversationType: "cotisation",
        cotisationId: req.params.id,
        senderId: req.userId!,
        content, mediaUrl,
        messageType: messageType || "user",
      },
      include: { sender: { select: { id: true, firstName: true, lastName: true, phone: true, avatarUrl: true } } },
    });
    // TODO: Socket.io broadcast to room
    res.status(201).json(message);
  } catch (err) { next(err); }
});

export default router;
