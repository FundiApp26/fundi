// @ts-nocheck
import { Router, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();
router.use(authMiddleware);

// GET /api/discussions — List my discussions (interface: Home Discussion)
router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const discussions = await prisma.discussion.findMany({
      where: { OR: [{ user1Id: req.userId }, { user2Id: req.userId }] },
      include: {
        user1: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, isOnline: true } },
        user2: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, isOnline: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { lastMessageAt: { sort: "desc", nulls: "last" } },
    });

    const list = discussions.map((d) => {
      const contact = d.user1Id === req.userId ? d.user2 : d.user1;
      const lastMsg = d.messages[0];
      return {
        id: d.id,
        contact,
        lastMessage: lastMsg ? { text: lastMsg.content, time: lastMsg.createdAt, type: lastMsg.messageType } : null,
        unreadCount: 0, // TODO: compute from read receipts
      };
    });

    res.json(list);
  } catch (err) { next(err); }
});

// POST /api/discussions — Create or get discussion (interface: Nouvelle discussion)
router.post("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId requis" });

    const [u1, u2] = [req.userId!, userId].sort();
    let discussion = await prisma.discussion.findUnique({ where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } } });

    if (!discussion) {
      discussion = await prisma.discussion.create({ data: { user1Id: u1, user2Id: u2 } });
    }

    res.status(201).json(discussion);
  } catch (err) { next(err); }
});

// GET /api/discussions/:id/messages — Get messages (interface: Chat 1-to-1)
router.get("/:id/messages", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cursor = req.query.cursor as string | undefined;
    const take = 50;

    const messages = await prisma.message.findMany({
      where: { discussionId: req.params.id },
      include: { sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
      orderBy: { createdAt: "desc" },
      take,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
    });

    res.json(messages.reverse());
  } catch (err) { next(err); }
});

// POST /api/discussions/:id/messages — Send message
router.post("/:id/messages", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { content, mediaUrl, messageType, moneyAmount } = req.body;

    const message = await prisma.message.create({
      data: {
        conversationType: "discussion",
        discussionId: req.params.id,
        senderId: req.userId!,
        content, mediaUrl,
        messageType: messageType || "user",
        moneyAmount: moneyAmount || null,
      },
      include: { sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
    });

    await prisma.discussion.update({ where: { id: req.params.id }, data: { lastMessageAt: new Date() } });

    // TODO: emit via Socket.io for real-time

    res.status(201).json(message);
  } catch (err) { next(err); }
});

export default router;
