"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { CommentItem } from "@/lib/comments";
import { Lock, LogIn } from "lucide-react";

interface PostCommentsSectionProps {
  postId: string;
  isLoggedIn: boolean;
}

export default function PostCommentsSection({ postId, isLoggedIn }: PostCommentsSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const reactToComment = useCallback(async (commentId: string, reaction: "like" | "heart") => {
    const response = await fetch(`/api/comments/${commentId}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reaction }),
    });

    if (response.ok) await fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <section className="mt-8 border-t border-slate-200/50 dark:border-slate-800/50 pt-8 space-y-8">
      {/* Auth Protection Prompt (Task W.3) */}
      {isLoggedIn ? (
        <CommentForm postId={postId} onCommentAdded={fetchComments} />
      ) : (
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                เข้าสู่ระบบเพื่อแสดงความคิดเห็น
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                // Protected Feature: ต้อง Login ก่อนใช้งาน
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>เข้าสู่ระบบตอนนี้</span>
          </Link>
        </div>
      )}

      {/* Comment List */}
      <CommentList comments={comments} isLoading={isLoading} onReact={reactToComment} />
    </section>
  );
}
