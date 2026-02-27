import { HttpError } from "../../utils/httpError";
import { prisma } from "../../db/prisma";
import { subscriptionsRepo } from "./subscriptions.repo";

export const subscriptionsService = {
  async activate(userId: string, packageId: string) {
    const pkg = await prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) throw new HttpError(404, "Package not found");
    if (!pkg.isActive) throw new HttpError(400, "Package is inactive");

    await prisma.$transaction(async (tx) => {
      await tx.userSubscription.updateMany({
        where: { userId, endAt: null },
        data: { endAt: new Date() },
      });
      await tx.userSubscription.create({ data: { userId, packageId } });
    });

    return subscriptionsRepo.getActive(userId);
  },

  async history(userId: string) {
    return subscriptionsRepo.history(userId);
  },
};