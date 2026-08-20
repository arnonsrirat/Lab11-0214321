export interface CommentItem {
  id: string;
  postId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Memory Data Store สำหรับความคิดเห็น (Model)
const comments: CommentItem[] = [
  {
    id: "comment-1",
    postId: "1",
    author: "admin@tsu.ac.th",
    rating: 5,
    comment: "บทความนี้มีประโยชน์มากครับ อธิบายแนวคิดและ REST API ได้เข้าใจง่ายดีเยี่ยม",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export function getCommentsByPostId(postId: string): CommentItem[] {
  return comments.filter((c) => c.postId === postId);
}

export function addComment(data: Omit<CommentItem, "id" | "createdAt">): CommentItem {
  const newComment: CommentItem = {
    id: `comment-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...data,
  };
  comments.unshift(newComment);
  return newComment;
}
