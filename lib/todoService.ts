import * as TodoModel from "./todos";
import { NotFoundError, ValidationError } from "./errors";

export function createTodo(data: { title: string }) {
  if (!data.title || data.title.trim() === "") {
    throw new ValidationError("กรุณาระบุชื่องาน (title)");
  }
  return TodoModel.addTodo({ title: data.title.trim() });
}

export function listTodos() {
  return TodoModel.getTodos();
}

export function getTodo(id: string) {
  const todo = TodoModel.getTodoById(id);
  if (!todo) {
    throw new NotFoundError("ไม่พบงานนี้");
  }
  return todo;
}

export function editTodo(id: string, updates: Partial<{ title: string; done: boolean }>) {
  if (updates.title !== undefined && updates.title.trim() === "") {
    throw new ValidationError("ชื่องานห้ามเป็นค่าว่าง");
  }
  const updated = TodoModel.updateTodo(id, updates);
  if (!updated) {
    throw new NotFoundError("ไม่พบงานนี้");
  }
  return updated;
}

export function removeTodo(id: string) {
  const ok = TodoModel.deleteTodo(id);
  if (!ok) {
    throw new NotFoundError("ไม่พบงานนี้");
  }
  return ok;
}
