import { prisma } from "./prisma";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isDeleted?: boolean;
}

// ใช้ globalThis เพื่อให้ข้อมูลคงอยู่ข้าม HMR และระหว่าง API Route / Server Component ในช่วง dev
const globalForMessages = globalThis as unknown as {
  messages: ContactMessage[];
};

if (!globalForMessages.messages) {
  globalForMessages.messages = [];
}

const messages = globalForMessages.messages;

export async function addMessage(data: {
  name: string;
  email: string;
  message: string;
}) {
  return prisma.message.create({ data });
}

export async function getMessages() {
  return prisma.message.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getMessageById(id: string) {
  return prisma.message.findUnique({ where: { id } });
}

export async function updateMessage(id: string, updates: { message?: string }) {
  return prisma.message.update({ where: { id }, data: updates });
}

export function editMessage(id: string, updates: object) {
  return updateMessage(id, updates);
}

export async function deleteMessage(id: string) {
  return prisma.message.delete({ where: { id } });
}

export function softDeleteMessage(id: string) {
  const index = messages.findIndex((m) => m.id === id);
  if (index === -1) return false;
  messages[index].isDeleted = true; // ← ไม่ splice ออกจริง แค่ตั้ง flag
  return true;
}
