export interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
  authorId: string | null;
  content: string;
  createdAt: string;
}

// Memory Data Store สำหรับเก็บข้อมูลบทความ (Model)
// ใช้ globalThis เพื่อให้ข้อมูลคงอยู่ข้าม HMR และระหว่าง API Route / Server Component ในช่วง dev
const globalForPosts = globalThis as unknown as {
  customPosts: BlogPost[];
};

if (!globalForPosts.customPosts) {
  globalForPosts.customPosts = [
    {
      id: "custom-1",
      title: "เริ่มต้นเรียนรู้ Next.js App Router และ Server Components",
      category: "Web Development",
      author: "admin@tsu.ac.th",
      authorId: null,
      content: "Next.js App Router ช่วยให้เราสามารถพัฒนาเว็บแอปพลิเคชันที่มีประสิทธิภาพสูงด้วย Server Components และ Client Components ที่ทำงานร่วมกันอย่างราบรื่น",
      createdAt: new Date().toISOString(),
    },
  ];
}

const customPosts = globalForPosts.customPosts;

export function addPost(data: Omit<BlogPost, "id" | "createdAt">): BlogPost {
  const newPost: BlogPost = {
    id: `custom-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...data,
  };
  customPosts.unshift(newPost);
  return newPost;
}

export function getPosts(): BlogPost[] {
  return customPosts;
}

export function getPostById(id: string): BlogPost | undefined {
  return customPosts.find((p) => p.id === id);
}

export function updatePost(
  id: string,
  updates: Partial<Pick<BlogPost, "title" | "category" | "author" | "content">>
): BlogPost | undefined {
  const post = customPosts.find((p) => p.id === id);
  if (!post) return undefined;
  Object.assign(post, updates);
  return post;
}

export function deletePost(id: string): boolean {
  const index = customPosts.findIndex((p) => p.id === id);
  if (index === -1) return false;
  customPosts.splice(index, 1);
  return true;
}

export function validatePostFields(data: {
  title?: unknown;
  category?: unknown;
  author?: unknown;
  content?: unknown;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.title || typeof data.title !== "string" || data.title.trim().length < 5) {
    errors.title = "หัวข้อบทความต้องมีความยาวอย่างน้อย 5 ตัวอักษร";
  }

  if (!data.category || typeof data.category !== "string" || data.category.trim() === "") {
    errors.category = "กรุณาเลือกหมวดหมู่บทความ";
  }

  if (!data.author || typeof data.author !== "string" || data.author.trim() === "") {
    errors.author = "กรุณาระบุชื่อผู้เขียน";
  }

  if (!data.content || typeof data.content !== "string" || data.content.trim().length < 20) {
    errors.content = "เนื้อหาบทความต้องมีความยาวอย่างน้อย 20 ตัวอักษร";
  }

  return errors;
}
