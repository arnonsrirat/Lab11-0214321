import type { Metadata } from "next";
import Link from "next/link";
import { BookText, ChevronRight, PlusCircle, Sparkles } from "lucide-react";
import { getPosts as getCustomPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "บทความทั้งหมด | CIS Blog",
  description: "รวมบทความทั้งหมดในบล็อก",
};

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default async function PostsPage() {
  // ดึงข้อมูลบทความจาก JSONPlaceholder API
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=8", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");
  const apiPosts: Post[] = await res.json();

  // ดึงข้อมูลบทความใหม่ที่สร้างผ่าน Model (lib/posts.ts)
  const customPosts = getCustomPosts();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in py-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <span>บทความทั้งหมด</span>
            <BookText className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">
            // Blog Aggregator & User Created Posts
          </p>
        </div>

        {/* Task W.1 / W.3 Button: Link to Protected Create Post Page */}
        <Link
          href="/posts/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-indigo-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>เขียนบทความใหม่</span>
        </Link>
      </div>

      {/* Section 1: User Created Custom Posts */}
      {customPosts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            บทความสมาชิกล่าสุด (User Posts)
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {customPosts.map((post) => (
              <div
                key={post.id}
                className="glass-panel p-6 rounded-3xl border border-indigo-500/30 dark:border-indigo-400/30 bg-indigo-50/20 dark:bg-indigo-950/10 block transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full font-bold">
                    {post.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center text-xs text-slate-400 font-mono">
                  <span>โดย: {post.author}</span>
                  <span className="text-indigo-500 font-bold">User Post</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: External Aggregated Posts */}
      <div className="space-y-3 pt-4">
        <h2 className="text-sm font-mono font-bold text-slate-500 dark:text-slate-400">
          // บทความภายนอก (External Aggregated)
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {apiPosts.map((post: Post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="group glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 block transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
            >
              <span className="text-[10px] font-mono text-indigo-500/80 dark:text-indigo-400 bg-indigo-500/5 dark:bg-indigo-400/5 px-2.5 py-1 rounded-full border border-indigo-500/10 dark:border-indigo-400/10">
                POST #{post.id}
              </span>
              <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mt-3 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                {post.body}
              </p>
              <div className="mt-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                <span>อ่านรายละเอียด</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
