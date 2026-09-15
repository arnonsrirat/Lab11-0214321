import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ChevronLeft, PenSquare, ShieldAlert } from "lucide-react";
import CreatePostForm from "@/components/CreatePostForm";
import { getPostById } from "@/lib/posts";

export const metadata: Metadata = {
  title: "แก้ไขบทความ | CIS Blog",
  description: "ฟอร์มแก้ไขบทความสำหรับเจ้าของบทความ",
};

type Props = {
  params: Promise<{ id: string }>;
};

function Blocked({ title, message }: { title: string; message: string }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in text-center py-12">
      <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h1 className="text-2xl font-black text-rose-500">{title}</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
      <Link
        href="/posts"
        className="inline-block mt-4 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        ย้อนกลับไปหน้าบทความทั้งหมด
      </Link>
    </div>
  );
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = getPostById(id);

  if (!post) {
    return <Blocked title="ไม่พบบทความนี้" message="บทความที่คุณต้องการแก้ไขอาจถูกลบไปแล้ว" />;
  }

  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  const sessionUserId = session?.value || null;

  if (!sessionUserId) {
    return <Blocked title="กรุณาเข้าสู่ระบบ" message="คุณต้องเข้าสู่ระบบก่อนจึงจะแก้ไขบทความได้" />;
  }

  if (post.authorId !== sessionUserId) {
    return <Blocked title="ไม่มีสิทธิ์แก้ไขบทความนี้" message="คุณสามารถแก้ไขได้เฉพาะบทความที่คุณเป็นเจ้าของเท่านั้น" />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in py-6">
      <Link
        href={`/posts/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        ย้อนกลับไปบทความนี้
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <span>แก้ไขบทความ</span>
            <PenSquare className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            แก้ไขข้อมูลบทความของคุณแล้วบันทึกการเปลี่ยนแปลง
          </p>
        </div>
      </div>

      <CreatePostForm
        mode="edit"
        postId={post.id}
        initialPost={{
          title: post.title,
          category: post.category,
          author: post.author,
          content: post.content,
        }}
      />
    </div>
  );
}
