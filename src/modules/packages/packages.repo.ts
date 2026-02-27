import { prisma } from "../../db/prisma";

export const packagesRepo = {
  create: (data: any) => prisma.package.create({ data }),
  findById: (id: string) => prisma.package.findUnique({ where: { id } }),
  listAdmin: () => prisma.package.findMany({ orderBy: { createdAt: "asc" } }),
  listActive: () => prisma.package.findMany({ where: { isActive: true }, orderBy: { createdAt: "asc" } }),
  update: (id: string, data: any) => prisma.package.update({ where: { id }, data }),
  deactivate: (id: string) => prisma.package.update({ where: { id }, data: { isActive: false } }),
};