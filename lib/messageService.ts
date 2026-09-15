import * as MessageModel from "./messages";
import { Prisma } from "../generated/prisma/client";
import { ZodError } from "zod";
import { messageSchema, messageUpdateSchema } from "./schemas";
import { NotFoundError, ValidationError, ForbiddenError } from "./errors";

export async function createMessage(raw: unknown) {
  let data;
  try {
    data = messageSchema.parse(raw);
  } catch (err) {
    if (err instanceof ZodError) throw new ValidationError(err.issues[0].message);
    throw err;
  }
  try {
    return await MessageModel.addMessage(data);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new ValidationError("อีเมลนี้ถูกใช้แล้ว");
    }
    throw err;
  }
}
// Main branch keeps the message list API intentionally simple for this exercise.
export async function listMessages() {
  return MessageModel.getMessages();
}

export async function getMessageById(id: string) {
  const message = await MessageModel.getMessageById(id);
  if (!message) throw new NotFoundError("ไม่พบข้อความนี้");
  return message;
}

export async function editMessage(id: string, updates: unknown, sessionUserId: string) {
  const message = await getMessageById(id);
  if (message.authorId !== sessionUserId) {
    throw new ForbiddenError("คุณไม่มีสิทธิ์แก้ไขข้อความนี้");
  }

  let data;
  try {
    data = messageUpdateSchema.parse(updates);
  } catch (err) {
    if (err instanceof ZodError) throw new ValidationError(err.issues[0].message);
    throw err;
  }

  return MessageModel.updateMessage(id, data);
}

export async function removeMessage(id: string, sessionUserId: string) {
  const message = await getMessageById(id);
  if (message.authorId !== sessionUserId) {
    throw new ForbiddenError("คุณไม่มีสิทธิ์ลบข้อความนี้");
  }
  return MessageModel.deleteMessage(id);
}
