import { env } from "../config/env";
import prisma from "../lib/prisma";

export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface PushProvider {
  send(token: string, payload: PushPayload): Promise<{ success: boolean }>;
}

// --- Firebase FCM Provider ---
class FcmProvider implements PushProvider {
  private accessToken: string | null = null;
  private tokenExpiresAt = 0;

  private async getAccessToken(): Promise<string> {
    // Simplified: in production, use google-auth-library for proper JWT
    if (this.accessToken && Date.now() < this.tokenExpiresAt) return this.accessToken;
    // For MVP, use Firebase Admin SDK approach
    console.log("[Push] FCM token refresh needed - implement google-auth-library");
    return "";
  }

  async send(token: string, payload: PushPayload) {
    try {
      const accessToken = await this.getAccessToken();
      const res = await fetch(
        `https://fcm.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/messages:send`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            message: {
              token,
              notification: { title: payload.title, body: payload.body },
              data: payload.data || {},
            },
          }),
        }
      );
      return { success: res.ok };
    } catch {
      return { success: false };
    }
  }
}

// --- Console Provider ---
class ConsolePushProvider implements PushProvider {
  async send(token: string, payload: PushPayload) {
    console.log(`[PUSH-DEV] Token: ${token.substring(0, 20)}... | ${payload.title}: ${payload.body}`);
    return { success: true };
  }
}

function createProvider(): PushProvider {
  if (env.FIREBASE_PROJECT_ID && env.FIREBASE_PRIVATE_KEY) {
    console.log("[Push] Using FCM provider");
    return new FcmProvider();
  }
  console.log("[Push] Using Console provider (dev mode)");
  return new ConsolePushProvider();
}

const provider = createProvider();

// Send push + save to notifications table
export async function sendPushNotification(
  userId: string,
  payload: PushPayload & { type: string }
) {
  // Save in-app notification
  await prisma.notification.create({
    data: {
      userId,
      title: payload.title,
      body: payload.body,
      type: payload.type,
      data: payload.data ? JSON.stringify(payload.data) : null,
    },
  });

  // Send push if user has FCM token
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { fcmToken: true } });
  if (user?.fcmToken) {
    await provider.send(user.fcmToken, payload);
  }
}

// Notify all members of a cotisation
export async function notifyCotisationMembers(
  cotisationId: string,
  excludeUserId: string,
  payload: PushPayload & { type: string }
) {
  const members = await prisma.cotisationMember.findMany({
    where: { cotisationId, userId: { not: excludeUserId } },
    select: { userId: true },
  });

  await Promise.allSettled(
    members.map((m) => sendPushNotification(m.userId, payload))
  );
}
