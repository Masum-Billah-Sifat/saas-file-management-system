import { prisma } from "../../db/prisma";

export const subscriptionsRepo = {
  getActive: (userId: string) =>
    prisma.userSubscription.findFirst({
      where: { userId, endAt: null },
      include: { pkg: true },
    }),

  closeActive: (userId: string) =>
    prisma.userSubscription.updateMany({
      where: { userId, endAt: null },
      data: { endAt: new Date() },
    }),

  create: (userId: string, packageId: string) =>
    prisma.userSubscription.create({
      data: { userId, packageId },
      include: { pkg: true },
    }),

  history: (userId: string) =>
    prisma.userSubscription.findMany({
      where: { userId },
      include: { pkg: true },
      orderBy: { startAt: "desc" },
    }),
};