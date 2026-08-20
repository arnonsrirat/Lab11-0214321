import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark as BookmarkIcon } from "lucide-react";
import { listBookmarks } from "@/lib/bookmarkService";
import DeleteBookmarkButton from "@/components/DeleteBookmarkButton";

export const metadata: Metadata = {
  title: "บุ๊กมาร์กของฉัน | CIS Blog",
  description: "รายการบทความที่บันทึกไว้อ่านภายหลัง",
};

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const bookmarks = await listBookmarks();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <span>บุ๊กมาร์กของฉัน</span>
          <BookmarkIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">
          // {bookmarks.length} บทความที่บันทึกไว้
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center p-8 border rounded-2xl border-slate-200/50 dark:border-slate-800/50 text-slate-500 text-sm">
          ยังไม่มีบทความที่บันทึกไว้ — ลองกด &quot;บันทึกบทความ&quot; จากหน้ารายละเอียดบทความ
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <Link
                  href={bookmark.url}
                  className="font-bold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1"
                >
                  {bookmark.title}
                </Link>
                {bookmark.note && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {bookmark.note}
                  </p>
                )}
                <p className="text-xs text-slate-400 font-mono mt-2">
                  {new Date(bookmark.createdAt).toLocaleString()}
                </p>
              </div>
              <DeleteBookmarkButton id={bookmark.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
