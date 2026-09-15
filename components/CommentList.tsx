"use client";

import { CommentItem } from "@/lib/comments";
import { Heart, MessageSquare, Star, ThumbsUp, User } from "lucide-react";
import { useState } from "react";

interface CommentListProps {
  comments: CommentItem[];
  isLoading?: boolean;
  onReact?: (commentId: string, reaction: "like" | "heart") => Promise<void>;
}

export default function CommentList({ comments, isLoading, onReact }: CommentListProps) {
  const [pendingReaction, setPendingReaction] = useState<string | null>(null);

  async function handleReact(commentId: string, reaction: "like" | "heart") {
    if (!onReact || pendingReaction) return;
    setPendingReaction(`${commentId}:${reaction}`);
    try {
      await onReact(commentId, reaction);
    } finally {
      setPendingReaction(null);
    }
  }

  if (isLoading) {
    return (
      <div className="py-8 text-center text-xs font-mono text-slate-400 animate-pulse">
        กำลังโหลดความคิดเห็น...
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center py-8">
        <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          ยังไม่มีความคิดเห็นในบทความนี้ เป็นคนแรกที่แสดงความคิดเห็น!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        ความคิดเห็นทั้งหมด ({comments.length})
      </h3>

      <div className="space-y-3">
        {comments.map((c) => (
          <div
            key={c.id}
            className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {c.author}
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {new Date(c.createdAt).toLocaleString("th-TH")}
                  </p>
                </div>
              </div>

              {/* Star Rating Display */}
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= c.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed pl-10">
              {c.comment}
            </p>

            <div className="pl-10 flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleReact(c.id, "like")}
                disabled={pendingReaction !== null}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700"
                aria-label="ถูกใจความคิดเห็น"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                <span aria-live="polite">{c.reactions.like}</span>
              </button>
              <button
                type="button"
                onClick={() => handleReact(c.id, "heart")}
                disabled={pendingReaction !== null}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 transition hover:border-rose-300 hover:text-rose-600 dark:border-slate-700"
                aria-label="รักความคิดเห็น"
              >
                <Heart className="h-3.5 w-3.5" />
                <span aria-live="polite">{c.reactions.heart}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
