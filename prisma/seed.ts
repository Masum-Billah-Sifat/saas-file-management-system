// import { PrismaClient, Role } from "@prisma/client";
// import bcrypt from "bcrypt";

// const prisma = new PrismaClient();

// async function main() {
//   const email = process.env.ADMIN_EMAIL;
//   const password = process.env.ADMIN_PASSWORD;
//   const name = process.env.ADMIN_NAME || "Admin";

//   if (!email || !password) {
//     throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in env");
//   }

//   const passwordHash = await bcrypt.hash(password, 10);

//   await prisma.user.upsert({
//     where: { email },
//     update: {
//       name,
//       role: Role.ADMIN,
//       passwordHash,
//       isArchived: false,
//       isEmailVerified: true,
//     },
//     create: {
//       name,
//       email,
//       role: Role.ADMIN,
//       passwordHash,
//       isArchived: false,
//       isEmailVerified: true,
//     },
//   });

//   console.log("✅ Seeded admin:", email);
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import { PrismaClient, Role, FileKind } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";
  if (!email || !password) throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD");

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      role: Role.ADMIN,
      passwordHash,
      isArchived: false,
      isEmailVerified: true,
    },
    create: {
      name,
      email,
      role: Role.ADMIN,
      passwordHash,
      isArchived: false,
      isEmailVerified: true,
    },
  });

  console.log("✅ Seeded admin:", email);
}

async function seedPackages() {
  const packages: Array<{
    name: string;
    isSystem: boolean;
    isActive: boolean;
    maxFolders: number;
    maxNestingLevel: number;
    allowedTypes: FileKind[];
    maxFileSizeMB: number;
    totalFileLimit: number;
    filesPerFolder: number;
  }> = [
    {
      name: "Free",
      isSystem: true,
      isActive: true,
      maxFolders: 10,
      maxNestingLevel: 3,
      allowedTypes: [FileKind.IMAGE, FileKind.PDF],
      maxFileSizeMB: 5,
      totalFileLimit: 20,
      filesPerFolder: 10,
    },
    {
      name: "Silver",
      isSystem: false,
      isActive: true,
      maxFolders: 50,
      maxNestingLevel: 5,
      allowedTypes: [FileKind.IMAGE, FileKind.PDF, FileKind.AUDIO],
      maxFileSizeMB: 20,
      totalFileLimit: 200,
      filesPerFolder: 50,
    },
    {
      name: "Gold",
      isSystem: false,
      isActive: true,
      maxFolders: 200,
      maxNestingLevel: 10,
      allowedTypes: [FileKind.IMAGE, FileKind.PDF, FileKind.AUDIO, FileKind.VIDEO],
      maxFileSizeMB: 100,
      totalFileLimit: 2000,
      filesPerFolder: 200,
    },
    {
      name: "Diamond",
      isSystem: false,
      isActive: true,
      maxFolders: 1000,
      maxNestingLevel: 20,
      allowedTypes: [FileKind.IMAGE, FileKind.PDF, FileKind.AUDIO, FileKind.VIDEO],
      maxFileSizeMB: 500,
      totalFileLimit: 20000,
      filesPerFolder: 1000,
    },
  ];

  for (const p of packages) {
    await prisma.package.upsert({
      where: { name: p.name },
      update: p,
      create: p,
    });
  }

  console.log("✅ Seeded packages: Free/Silver/Gold/Diamond");
}

async function main() {
  await seedAdmin();
  await seedPackages();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });