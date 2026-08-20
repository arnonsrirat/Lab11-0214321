"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

export default function BookmarkButton({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [status, setStatus] = useState<"idle" | "saved" | "duplicate" | "error">(
    "idle"
  );
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, title }),
      });
      if (res.status === 201) {
        setStatus("saved");
      } else if (res.status === 409) {
        setStatus("duplicate");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  const saved = status === "saved" || status === "duplicate";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={loading || saved}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {saved ? (
          <BookmarkCheck className="w-3.5 h-3.5" />
        ) : (
          <Bookmark className="w-3.5 h-3.5" />
        )}
        {saved ? "บันทึกไว้แล้ว" : "บันทึกบทความ"}
      </button>
      {status === "error" && (
        <span className="text-xs text-rose-500">เกิดข้อผิดพลาด ลองใหม่อีกครั้ง</span>
      )}
    </div>
  );
}
