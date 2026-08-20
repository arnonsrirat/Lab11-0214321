export interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

// ใช้ globalThis เพื่อให้ข้อมูลคงอยู่ข้าม HMR และระหว่าง API Route / Server Component ในช่วง dev
const globalForTodos = globalThis as unknown as {
  todos: Todo[];
};

if (!globalForTodos.todos) {
  globalForTodos.todos = [];
}

const todos = globalForTodos.todos;

export function addTodo(data: { title: string }) {
  const item: Todo = {
    id: crypto.randomUUID(),
    title: data.title,
    done: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(item);
  return item;
}

export function getTodos() {
  return todos;
}

export function getTodoById(id: string) {
  return todos.find((t) => t.id === id) ?? null;
}

export function updateTodo(id: string, updates: Partial<Omit<Todo, "id" | "createdAt">>) {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return null;
  todos[index] = { ...todos[index], ...updates };
  return todos[index];
}

export function deleteTodo(id: string) {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
}
