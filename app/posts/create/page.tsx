import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, PenSquare } from "lucide-react";
import CreatePostForm from "@/components/CreatePostForm";

export const metadata: Metadata = {
  title: "สร้างบทความใหม่ | CIS Blog",
  description: "ฟอร์มสร้างบทความใหม่สำหรับสมาชิก",
};

export default function CreatePostPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in py-6">
      <Link
        href="/posts"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        ย้อนกลับไปบทความทั้งหมด
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <span>สร้างบทความใหม่</span>
            <PenSquare className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            กรอกข้อมูลในฟอร์มเพื่อเพิ่มบทความเข้าสู่ระบบ Blog Aggregator
          </p>
        </div>
      </div>

      {/* Controlled Form Component */}
      <CreatePostForm />
    </div>
  );
}
