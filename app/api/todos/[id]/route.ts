import { getTodo, editTodo, removeTodo } from "@/lib/todoService";
import { withErrorHandling } from "@/lib/withErrorHandling";

// Controller: GET /api/todos/[id] - ดึงงานเดียวตาม id
export const GET = withErrorHandling(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const todo = getTodo(id);
    return Response.json({ item: todo });
  }
);

// Controller: PATCH /api/todos/[id] - แก้ไขงาน (เช่น เปลี่ยนชื่อ, ติ๊กว่าทำเสร็จ)
export const PATCH = withErrorHandling(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const updates = await request.json();
    const updated = editTodo(id, updates);
    return Response.json({ ok: true, item: updated });
  }
);

// Controller: DELETE /api/todos/[id] - ลบงาน
export const DELETE = withErrorHandling(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    await removeTodo(id);
    return Response.json({ ok: true }, { status: 200 });
  }
);
