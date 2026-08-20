import { createTodo, listTodos } from "@/lib/todoService";
import { withErrorHandling } from "@/lib/withErrorHandling";

// Controller: GET /api/todos - ดึงรายการงานทั้งหมด
export const GET = withErrorHandling(async () => {
  return Response.json({ todos: listTodos() });
});

// Controller: POST /api/todos - สร้างงานใหม่
export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json();
  const todo = createTodo(body);
  return Response.json({ ok: true, item: todo }, { status: 201 });
});
