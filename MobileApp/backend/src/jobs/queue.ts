import Bull from "bull";
import { env } from "../config/env";
import prisma from "../lib/prisma";
import { sendOtpSms, sendReminderSms } from "../services/sms.service";
import { sendEmail } from "../services/email.service";
import { sendPushNotification, notifyCotisationMembers } from "../services/push.service";

export const smsQueue = new Bull("send-sms", env.REDIS_URL);
export const emailQueue = new Bull("send-email", env.REDIS_URL);
export const reminderQueue = new Bull("cotisation-reminder", env.REDIS_URL);
export const midnightCheckQueue = new Bull("midnight-check", env.REDIS_URL);
export const advanceTourQueue = new Bull("advance-tour", env.REDIS_URL);
export const resetSendsQueue = new Bull("reset-monthly-sends", env.REDIS_URL);

export function initializeQueues(): void {

  // --- SMS ---
  smsQueue.process(async (job) => {
    const { phone, message, type, code } = job.data;
    if (type === "otp") await sendOtpSms(phone, code);
    else await sendReminderSms(phone, message, "");
  });

  // --- Email ---
  emailQueue.process(async (job) => {
    await sendEmail(job.data);
  });

  // --- Cotisation reminder: 1h before deadline ---
  reminderQueue.process(async (job) => {
    const { cotisationId, tourId } = job.data;
    const cotisation = await prisma.cotisation.findUnique({
      where: { id: cotisationId },
      include: { members: { include: { user: { select: { id: true, phone: true, firstName: true } } } } },
    });
    if (!cotisation) return;

    const tour = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour || tour.status !== "active") return;

    // Get unpaid members
    const payments = await prisma.payment.findMany({ where: { tourId }, select: { payerId: true, status: true } });
    const paidIds = new Set(payments.filter((p) => p.status === "paid").map((p) => p.payerId));
    const beneficiaryId = tour.beneficiaryId;

    for (const member of cotisation.members) {
      if (paidIds.has(member.userId) || member.userId === beneficiaryId) continue;

      await sendPushNotification(member.userId, {
        title: "Rappel de cotisation",
        body: `L'heure limite de cotisation de ${cotisation.name} est ${cotisation.deadlineTime}`,
        type: "cotisation",
        data: { cotisationId, tourId },
      });
    }
  });

  // --- Midnight check: mark unpaid as failed ---
  midnightCheckQueue.process(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find active tours for today
    const activeTours = await prisma.tour.findMany({
      where: { status: "active", scheduledDate: { lte: today } },
      include: { cotisation: { select: { id: true, name: true, members: { select: { userId: true } } } } },
    });

    for (const tour of activeTours) {
      const payments = await prisma.payment.findMany({ where: { tourId: tour.id } });
      const paidUserIds = new Set(payments.filter((p) => p.status === "paid").map((p) => p.payerId));

      // Mark members who didn't pay as failed (except beneficiary)
      for (const member of tour.cotisation.members) {
        if (paidUserIds.has(member.userId) || member.userId === tour.beneficiaryId) continue;

        const existingPayment = payments.find((p) => p.payerId === member.userId);
        if (existingPayment) {
          await prisma.payment.update({ where: { id: existingPayment.id }, data: { status: "failed" } });
        } else {
          await prisma.payment.create({
            data: {
              tourId: tour.id,
              payerId: member.userId,
              amount: 0,
              status: "failed",
            },
          });
        }
      }

      // Complete tour, activate next
      await prisma.tour.update({ where: { id: tour.id }, data: { status: "completed" } });

      // Activate next tour
      const nextTour = await prisma.tour.findFirst({
        where: { cotisationId: tour.cotisationId, tourNumber: tour.tourNumber + 1 },
      });
      if (nextTour) {
        await prisma.tour.update({ where: { id: nextTour.id }, data: { status: "active" } });
        await notifyCotisationMembers(tour.cotisationId, "", {
          title: tour.cotisation.name,
          body: `Tour ${nextTour.tourNumber} a commencé`,
          type: "cotisation",
          data: { cotisationId: tour.cotisationId },
        });
      } else {
        // All tours completed → cotisation terminée
        await prisma.cotisation.update({ where: { id: tour.cotisationId }, data: { status: "completed" } });
      }
    }
  });

  // --- Advance tour manually ---
  advanceTourQueue.process(async (job) => {
    const { cotisationId, tourId } = job.data;
    await prisma.tour.update({ where: { id: tourId }, data: { status: "completed" } });
    const tour = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour) return;
    const nextTour = await prisma.tour.findFirst({
      where: { cotisationId, tourNumber: tour.tourNumber + 1 },
    });
    if (nextTour) {
      await prisma.tour.update({ where: { id: nextTour.id }, data: { status: "active" } });
    }
  });

  // --- Reset monthly sends (1st of each month) ---
  resetSendsQueue.process(async () => {
    await prisma.user.updateMany({ data: { monthlySends: 0, sendsResetAt: new Date() } });
    console.log("[Queue] Monthly sends reset for all users");
  });

  // Schedule recurring jobs
  midnightCheckQueue.add({}, { repeat: { cron: "0 0 * * *" } }); // Every midnight
  resetSendsQueue.add({}, { repeat: { cron: "0 0 1 * *" } }); // 1st of month

  console.log("[Queue] All queues initialized with processors");
}

// Helper: schedule reminder 1h before deadline for a cotisation tour
export async function scheduleReminder(cotisationId: string, tourId: string, deadlineTime: string, scheduledDate: Date) {
  const [hours, minutes] = deadlineTime.split(":").map(Number);
  const reminderDate = new Date(scheduledDate);
  reminderDate.setHours(hours - 1, minutes, 0, 0); // 1h before

  if (reminderDate > new Date()) {
    await reminderQueue.add({ cotisationId, tourId }, { delay: reminderDate.getTime() - Date.now() });
  }
}
