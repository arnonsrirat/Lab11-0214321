export interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
  content: string;
  createdAt: string;
}

// Memory Data Store สำหรับเก็บข้อมูลบทความ (Model)
const customPosts: BlogPost[] = [
  {
    id: "custom-1",
    title: "เริ่มต้นเรียนรู้ Next.js App Router และ Server Components",
    category: "Web Development",
    author: "admin@tsu.ac.th",
    content: "Next.js App Router ช่วยให้เราสามารถพัฒนาเว็บแอปพลิเคชันที่มีประสิทธิภาพสูงด้วย Server Components และ Client Components ที่ทำงานร่วมกันอย่างราบรื่น",
    createdAt: new Date().toISOString(),
  },
];

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
