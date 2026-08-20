import { prisma } from "./prisma";

export async function addBookmark(data: {
  url: string;
  title: string;
  note?: string;
}) {
  return prisma.bookmark.create({ data });
}

export async function getBookmarks() {
  return prisma.bookmark.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getBookmarkById(id: string) {
  return prisma.bookmark.findUnique({ where: { id } });
}

export async function updateBookmark(
  id: string,
  updates: { title?: string; note?: string }
) {
  return prisma.bookmark.update({ where: { id }, data: updates });
}

export async function deleteBookmark(id: string) {
  return prisma.bookmark.delete({ where: { id } });
}
