"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm("ยืนยันลบบทความนี้? การกระทำนี้ไม่สามารถย้อนกลับได้");
    if (!confirmed) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "ลบบทความไม่สำเร็จ");
        setLoading(false);
        return;
      }
      router.push("/posts");
      router.refresh();
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-full transition cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
        {loading ? "กำลังลบ..." : "ลบบทความ"}
      </button>
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}
