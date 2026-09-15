import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { AlertCircle, ChevronLeft, PenSquare } from "lucide-react";
import PostCommentsSection from "@/components/PostCommentsSection";
import BookmarkButton from "@/components/BookmarkButton";
import DeletePostButton from "@/components/DeletePostButton";
import { getPostById } from "@/lib/posts";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  const customPost = getPostById(id);
  if (customPost) {
    return {
      title: `${customPost.title} | CIS Blog`,
      description: customPost.content?.slice(0, 160) || "",
    };
  }

  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);

  if (!res.ok) {
    return { title: "ไม่พบบทความ" };
  }

  const post = await res.json();
  return {
    title: `${post.title} | CIS Blog`,
    description: post.body?.slice(0, 160) || "",
  };
}

interface Post {
  id: number;
  title: string;
  body: string;
}

export default async function PostDetail({ params }: Props) {
  const { id } = await params;

  // ตรวจสอบ Session Cookie จาก Server Side (Task W.3)
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  const isLoggedIn = Boolean(session && session.value);

  // 1. ตรวจก่อนว่าเป็นบทความที่สมาชิกสร้างเอง (Custom Post) หรือไม่
  const customPost = getPostById(id);

  if (customPost) {
    const isOwner = isLoggedIn && session?.value === customPost.authorId;

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <Link
          href="/posts"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          ย้อนกลับไปบทความทั้งหมด
        </Link>

        <article className="glass-panel p-8 sm:p-10 rounded-3xl border border-indigo-500/30 dark:border-indigo-400/30 bg-indigo-50/20 dark:bg-indigo-950/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl animate-pulse-glow" />

          <header className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-500/10 dark:border-indigo-400/10">
                {customPost.category}
              </span>
              {isOwner && (
                <div className="flex items-center gap-2">
                  <Link
                    href={`/posts/${customPost.id}/edit`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full transition"
                  >
                    <PenSquare className="w-3.5 h-3.5" />
                    แก้ไขบทความ
                  </Link>
                  <DeletePostButton postId={customPost.id} />
                </div>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white leading-tight">
              {customPost.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 font-mono border-y border-slate-200/30 dark:border-slate-800/30 py-3">
              <span>โดย: {customPost.author}</span>
              <span>•</span>
              <span>{new Date(customPost.createdAt).toLocaleDateString()}</span>
            </div>

            <BookmarkButton url={`/posts/${customPost.id}`} title={customPost.title} />
          </header>

          <section className="mt-8 text-slate-600 dark:text-slate-350 text-sm sm:text-base leading-relaxed space-y-4">
            <p className="whitespace-pre-wrap">{customPost.content}</p>
          </section>

          <PostCommentsSection postId={customPost.id} isLoggedIn={isLoggedIn} />
        </article>
      </div>
    );
  }

  // 2. ถ้าไม่ใช่บทความของสมาชิก ให้ดึงจาก External API เหมือนเดิม
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in text-center py-12">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-rose-500">ไม่พบบทความ #{id}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          กรุณาตรวจสอบลิงก์บทความใหม่อีกครั้ง
        </p>
        <Link
          href="/posts"
          className="inline-block mt-4 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ย้อนกลับไปหน้าบทความทั้งหมด
        </Link>
      </div>
    );
  }

  const post: Post = await res.json();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Link
        href="/posts"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        ย้อนกลับไปบทความทั้งหมด
      </Link>

      <article className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden">
        {/* Decorative corner glows */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl animate-pulse-glow" />

        <header className="space-y-4">
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-500/10 dark:border-indigo-400/10">
            ARTICLE #{post.id}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 font-mono border-y border-slate-200/30 dark:border-slate-800/30 py-3">
            <span>By: JSONPlaceholder</span>
            <span>•</span>
            <span>Category: Computer Science</span>
          </div>

          <BookmarkButton url={`/posts/${id}`} title={post.title} />
        </header>

        <section className="mt-8 text-slate-600 dark:text-slate-350 text-sm sm:text-base leading-relaxed space-y-4">
          <p>{post.body}</p>
          <p className="text-slate-400 dark:text-slate-500 italic text-xs mt-12 font-mono">
            // บทความนี้ถูกดึงผ่าน RESTful API เพื่อประกอบการเรียนรู้ในวิชาการพัฒนาเว็บแอปพลิเคชัน
          </p>
        </section>

        {/* Dynamic Comments & Rating Section (Task W.1 - W.4) */}
        <PostCommentsSection postId={id} isLoggedIn={isLoggedIn} />
      </article>
    </div>
  );
}
