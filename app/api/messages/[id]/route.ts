import { getMessageById, editMessage, removeMessage } from '@/lib/messageService';
import { withErrorHandling } from '@/lib/withErrorHandling';
import { getSessionUserId } from '@/lib/session';
import { UnauthorizedError } from '@/lib/errors';

type Ctx = { params: Promise<{ id: string }> };

export const GET = withErrorHandling(async (request: Request, ctx) => {
  const { params } = ctx as Ctx;
  const { id } = await params;
  const message = await getMessageById(id);
  return Response.json({ message });
});

export const PATCH = withErrorHandling(async (request: Request, ctx) => {
  const { params } = ctx as Ctx;
  const { id } = await params;
  const sessionUserId = await getSessionUserId();
  if (!sessionUserId) throw new UnauthorizedError('กรุณาเข้าสู่ระบบก่อนแก้ไขข้อความนี้');
  const updates = await request.json();
  const updated = await editMessage(id, updates, sessionUserId);
  return Response.json({ ok: true, item: updated });
});

export const DELETE = withErrorHandling(async (request: Request, ctx) => {
  const { params } = ctx as Ctx;
  const { id } = await params;
  const sessionUserId = await getSessionUserId();
  if (!sessionUserId) throw new UnauthorizedError('กรุณาเข้าสู่ระบบก่อนลบข้อความนี้');
  await removeMessage(id, sessionUserId);
  return Response.json({ ok: true }, { status: 200 });
});
