import { z } from "zod";

export const messageSchema = z.object({
  name: z.string().min(2, "ชื่อสั้นเกินไป").max(100),
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  message: z.string().min(5, "ข้อความสั้นเกินไป").max(1000),
  tag: z.enum(["question", "feedback", "bug"], {
    message: "กรุณาเลือกประเภทข้อความ",
  }),
});

export const messageUpdateSchema = messageSchema.partial();

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "กรุณากรอกรหัสผ่านเดิม"),
  newPassword: z.string().min(8, "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร"),
});
