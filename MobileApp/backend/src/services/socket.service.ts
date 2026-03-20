import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import prisma from "../lib/prisma";

let io: SocketIOServer | null = null;

// Map userId → socketId for direct messaging
const userSockets = new Map<string, string>();

export function initializeSocket(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: { origin: env.FRONTEND_URL, methods: ["GET", "POST"] },
  });

  // Auth middleware for Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication required"));
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
      (socket as any).userId = decoded.userId;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket: Socket) => {
    const userId = (socket as any).userId as string;
    userSockets.set(userId, socket.id);

    // Set user online
    await prisma.user.update({ where: { id: userId }, data: { isOnline: true, lastSeenAt: new Date() } }).catch(() => {});
    io!.emit("user_online", { userId });

    console.log(`[Socket] ${userId} connected (${socket.id})`);

    // Join all user's cotisation rooms automatically
    const memberships = await prisma.cotisationMember.findMany({ where: { userId }, select: { cotisationId: true } });
    memberships.forEach((m) => socket.join(`cotisation:${m.cotisationId}`));

    // Join discussion rooms
    const discussions = await prisma.discussion.findMany({
      where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
      select: { id: true },
    });
    discussions.forEach((d) => socket.join(`discussion:${d.id}`));

    // --- Events ---

    // Send message in discussion
    socket.on("send_discussion_message", async (data: { discussionId: string; content?: string; mediaUrl?: string }) => {
      const message = await prisma.message.create({
        data: {
          conversationType: "discussion",
          discussionId: data.discussionId,
          senderId: userId,
          content: data.content,
          mediaUrl: data.mediaUrl,
        },
        include: { sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
      });
      await prisma.discussion.update({ where: { id: data.discussionId }, data: { lastMessageAt: new Date() } });
      io!.to(`discussion:${data.discussionId}`).emit("new_message", message);
    });

    // Send message in cotisation group
    socket.on("send_cotisation_message", async (data: { cotisationId: string; content?: string; mediaUrl?: string }) => {
      const message = await prisma.message.create({
        data: {
          conversationType: "cotisation",
          cotisationId: data.cotisationId,
          senderId: userId,
          content: data.content,
          mediaUrl: data.mediaUrl,
        },
        include: { sender: { select: { id: true, firstName: true, lastName: true, phone: true, avatarUrl: true } } },
      });
      io!.to(`cotisation:${data.cotisationId}`).emit("new_message", message);
    });

    // Typing indicator
    socket.on("typing", (data: { roomId: string; roomType: string }) => {
      socket.to(`${data.roomType}:${data.roomId}`).emit("user_typing", { userId, roomId: data.roomId });
    });

    // Stop typing
    socket.on("stop_typing", (data: { roomId: string; roomType: string }) => {
      socket.to(`${data.roomType}:${data.roomId}`).emit("user_stop_typing", { userId, roomId: data.roomId });
    });

    // Payment notification in cotisation
    socket.on("payment_made", (data: { cotisationId: string; payerName: string; amount: number }) => {
      const systemMsg = `${data.payerName} a effectué un dépôt de ${data.amount} FCFA`;
      io!.to(`cotisation:${data.cotisationId}`).emit("system_message", {
        cotisationId: data.cotisationId,
        content: systemMsg,
        messageType: "system",
      });
    });

    // Disconnect
    socket.on("disconnect", async () => {
      userSockets.delete(userId);
      await prisma.user.update({ where: { id: userId }, data: { isOnline: false, lastSeenAt: new Date() } }).catch(() => {});
      io!.emit("user_offline", { userId });
      console.log(`[Socket] ${userId} disconnected`);
    });
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

export function getUserSocketId(userId: string): string | undefined {
  return userSockets.get(userId);
}
