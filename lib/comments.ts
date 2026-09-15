import { cleanRichText } from "./sanitize";

export interface CommentItem {
  id: string;
  postId: string;
  author: string;
  rating: number;
  comment: string;
  reactions: { like: number; heart: number };
  createdAt: string;
}

// Memory Data Store สำหรับความคิดเห็น (Model)
// ใช้ globalThis เพื่อให้ข้อมูลคงอยู่ข้าม HMR และระหว่าง API Route / Server Component ในช่วง dev
const globalForComments = globalThis as unknown as {
  comments: CommentItem[];
};

if (!globalForComments.comments) {
  globalForComments.comments = [
    {
      id: "comment-1",
      postId: "1",
      author: "admin@tsu.ac.th",
      rating: 5,
      reactions: { like: 0, heart: 0 },
      comment: "บทความนี้มีประโยชน์มากครับ อธิบายแนวคิดและ REST API ได้เข้าใจง่ายดีเยี่ยม",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];
}

const comments = globalForComments.comments;

export function getCommentsByPostId(postId: string): CommentItem[] {
  return comments.filter((c) => c.postId === postId);
}

export function addComment(data: Omit<CommentItem, "id" | "createdAt" | "reactions">): CommentItem {
  const newComment: CommentItem = {
    id: `comment-${Date.now()}`,
    createdAt: new Date().toISOString(),
    reactions: { like: 0, heart: 0 },
    ...data,
    comment: cleanRichText(data.comment), // ตัด <script>, onerror= ทิ้งก่อนเก็บ
  };
  comments.unshift(newComment);
  return newComment;
}
