import prisma from "../lib/prisma";
import { scheduleReminder } from "../jobs/queue";

// Generate tours automatically based on periodicity and members
export async function generateTours(cotisationId: string) {
  const cotisation = await prisma.cotisation.findUnique({
    where: { id: cotisationId },
    include: { members: { orderBy: { tourOrder: "asc" } } },
  });

  if (!cotisation || !cotisation.startDate) return;

  const members = cotisation.members;
  const startDate = new Date(cotisation.startDate);

  // Calculate interval in days
  const intervalDays: Record<string, number> = {
    daily: 1,
    "2days": 2,
    "3days": 3,
    weekly: 7,
  };
  const interval = intervalDays[cotisation.periodicity] || 7;

  // Create one tour per member
  const tours = members.map((member, index) => {
    const scheduledDate = new Date(startDate);
    scheduledDate.setDate(scheduledDate.getDate() + index * interval);

    return {
      cotisationId,
      tourNumber: index + 1,
      beneficiaryId: member.userId,
      scheduledDate,
      status: index === 0 ? "active" : "upcoming",
    };
  });

  // Delete existing tours and recreate
  await prisma.tour.deleteMany({ where: { cotisationId } });

  for (const tour of tours) {
    const created = await prisma.tour.create({ data: tour });

    // Schedule reminder 1h before deadline for first active tour
    if (tour.status === "active") {
      await scheduleReminder(cotisationId, created.id, cotisation.deadlineTime, tour.scheduledDate);
    }
  }

  return tours;
}

// Compute tour dates preview (before creation) for the frontend
export function computeTourDates(startDate: Date, periodicity: string, memberCount: number) {
  const intervalDays: Record<string, number> = { daily: 1, "2days": 2, "3days": 3, weekly: 7 };
  const interval = intervalDays[periodicity] || 7;

  return Array.from({ length: memberCount }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i * interval);
    return date;
  });
}
