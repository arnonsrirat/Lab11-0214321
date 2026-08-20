"use client";

import { useState } from "react";
import { Send, Star, AlertCircle, CheckCircle2 } from "lucide-react";

interface CommentFormProps {
  postId: string;
  onCommentAdded?: () => void;
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  
  // Validation & Status States
  const [fieldErrors, setFieldErrors] = useState<{ author?: string; rating?: string; comment?: string }>({});
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Task W.2: Client-side Validation (อย่างน้อย Field ละ 1 เงื่อนไข)
  function validateClient(): boolean {
    const errors: { author?: string; rating?: string; comment?: string } = {};

    if (!author.trim() || author.trim().length < 2) {
      errors.author = "ชื่อผู้แสดงความคิดเห็นต้องมีความยาวอย่างน้อย 2 ตัวอักษร";
    }

    if (rating < 1 || rating > 5) {
      errors.rating = "กรุณาเลือกระดับคะแนน 1-5 ดาว";
    }

    if (!comment.trim() || comment.trim().length < 5) {
      errors.comment = "ข้อความความคิดเห็นต้องมีความยาวอย่างน้อย 5 ตัวอักษร";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    setSuccessMsg("");

    // 1. เรียกใช้ Client Validation ก่อนส่ง Request
    if (!validateClient()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. ส่งข้อมูลผ่าน POST ไปยัง Server Route
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          author: author.trim(),
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "เกิดข้อผิดพลาดในการบันทึกความคิดเห็น");
        if (data.details) {
          setFieldErrors(data.details);
        }
        setIsSubmitting(false);
        return;
      }

      // สำเร็จ
      setSuccessMsg("ส่งความคิดเห็นของคุณเรียบร้อยแล้ว!");
      setComment("");
      setFieldErrors({});
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      setServerError("เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel p-6 rounded-3xl border border-indigo-500/20 dark:border-indigo-400/20 bg-indigo-500/5 dark:bg-indigo-950/10 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>แสดงความคิดเห็น</span>
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">
          Task W.1 Controlled Form
        </span>
      </div>

      {serverError && (
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Author Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            ชื่อของคุณ <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
              if (fieldErrors.author) setFieldErrors((prev) => ({ ...prev, author: undefined }));
            }}
            placeholder="กรอกชื่อหรืออีเมลของคุณ"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          {fieldErrors.author && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{fieldErrors.author}</p>
          )}
        </div>

        {/* Rating Star Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            ให้คะแนนบทความ <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-1.5 py-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className="p-1 hover:scale-110 transition-transform focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300 dark:text-slate-700"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-xs font-mono text-slate-500 font-bold">
              ({rating} / 5 ดาว)
            </span>
          </div>
          {fieldErrors.rating && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{fieldErrors.rating}</p>
          )}
        </div>
      </div>

      {/* Comment Textarea */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
          ข้อความความคิดเห็น <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (fieldErrors.comment) setFieldErrors((prev) => ({ ...prev, comment: undefined }));
          }}
          placeholder="พิมพ์ข้อความอย่างน้อย 5 ตัวอักษร..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
        />
        {fieldErrors.comment && (
          <p className="mt-1 text-xs text-rose-500 font-medium">{fieldErrors.comment}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white text-xs font-bold rounded-xl shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? "กำลังส่งข้อมูล..." : "ส่งความคิดเห็น"}</span>
        </button>
      </div>
    </form>
  );
}
