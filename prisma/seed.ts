import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
async function main() {
  const hashed = await bcrypt.hash("1234", 10);
  await prisma.user.upsert({
    where: { email: "admin@tsu.ac.th" },
    update: {},
    create: { email: "admin@tsu.ac.th", password: hashed },
  });

  await prisma.message.createMany({
    data: [
      { name: "Alice", email: "a@tsu.ac.th", message: "สวัสดี" },
      { name: "Bob", email: "b@tsu.ac.th", message: "Hello" },
    ],
    skipDuplicates: true,
  });

  await prisma.bookmark.createMany({
    data: [
      {
        url: "https://nextjs.org/docs",
        title: "Next.js Docs",
        note: "อ้างอิง routing และ server actions",
      },
      {
        url: "https://www.prisma.io/docs",
        title: "Prisma Docs",
        note: "อ้างอิง schema และ migrate",
      },
      {
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        title: "MDN JavaScript",
      },
    ],
    skipDuplicates: true,
  });
}
main();
