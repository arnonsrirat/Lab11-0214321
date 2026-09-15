import bcrypt from 'bcrypt';
import { ZodError } from 'zod';
import { findUserById, updateUserPassword } from '@/lib/users';
import { changePasswordSchema } from '@/lib/schemas';
import { withErrorHandling } from '@/lib/withErrorHandling';
import { getSessionUserId } from '@/lib/session';
import { UnauthorizedError, ValidationError } from '@/lib/errors';

export const POST = withErrorHandling(async (request: Request) => {
  const sessionUserId = await getSessionUserId();
  if (!sessionUserId) {
    throw new UnauthorizedError('กรุณาเข้าสู่ระบบก่อนเปลี่ยนรหัสผ่าน');
  }

  const raw = await request.json();
  let data;
  try {
    data = changePasswordSchema.parse(raw);
  } catch (err) {
    if (err instanceof ZodError) throw new ValidationError(err.issues[0].message);
    throw err;
  }

  const user = await findUserById(sessionUserId);
  if (!user) {
    throw new UnauthorizedError('ไม่พบผู้ใช้นี้ในระบบ');
  }

  const isOldPasswordValid = await bcrypt.compare(data.oldPassword, user.password);
  if (!isOldPasswordValid) {
    throw new UnauthorizedError('รหัสผ่านเดิมไม่ถูกต้อง');
  }

  await updateUserPassword(user.id, data.newPassword);
  return Response.json({ ok: true });
});
