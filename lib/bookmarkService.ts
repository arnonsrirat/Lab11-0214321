import * as BookmarkModel from "./bookmarks";
import { Prisma } from "../generated/prisma/client";

class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function createBookmark(data: {
  url: string;
  title: string;
  note?: string;
}) {
  if (!data.url || !data.title) throw new HttpError("ข้อมูลไม่ครบ", 400);
  try {
    return await BookmarkModel.addBookmark(data);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new HttpError("ลิงก์นี้ถูกบันทึกไว้แล้ว", 409);
    }
    throw err;
  }
}

export async function listBookmarks() {
  return BookmarkModel.getBookmarks();
}

export async function getBookmark(id: string) {
  return BookmarkModel.getBookmarkById(id);
}

export async function editBookmark(
  id: string,
  updates: { title?: string; note?: string }
) {
  try {
    return await BookmarkModel.updateBookmark(id, updates);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return null;
    }
    throw err;
  }
}

export async function removeBookmark(id: string) {
  try {
    await BookmarkModel.deleteBookmark(id);
    return true;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return false;
    }
    throw err;
  }
}
