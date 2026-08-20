"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Eye, Edit3, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function CreatePostForm() {
  const router = useRouter();

  // 1. Task W.1: Controlled Form States
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("admin@tsu.ac.th");
  const [content, setContent] = useState("");
  
  // States สำหรับควบคุม UI และ Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // 2. Task W.2: Client-side Validation (อย่างน้อย Field ละ 1 เงื่อนไข)
  function validateClient(): boolean {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "กรุณากรอกหัวข้อบทความ";
    } else if (title.trim().length < 5) {
      newErrors.title = "หัวข้อบทความต้องมีความยาวอย่างน้อย 5 ตัวอักษร";
    }

    if (!category) {
      newErrors.category = "กรุณาเลือกหมวดหมู่บทความ";
    }

    if (!author.trim()) {
      newErrors.author = "กรุณาระบุชื่อผู้เขียน";
    }

    if (!content.trim()) {
      newErrors.content = "กรุณากรอกเนื้อหาบทความ";
    } else if (content.trim().length < 20) {
      newErrors.content = "เนื้อหาบทความต้องมีความยาวอย่างน้อย 20 ตัวอักษร";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Submit Handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    // เรียกตรวจ Client Validation ก่อนส่งไป Server
    if (!validateClient()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, author, content }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          setErrors(data.details); // Error จาก Server Validation
        }
        setServerError(data.error || "ไม่สามารถสร้างบทความได้");
        setIsSubmitting(false);
        return;
      }

      // สำเร็จ
      setSuccessMessage("สร้างบทความใหม่เรียบร้อยแล้ว!");
      setIsSubmitting(false);

      // รีเซ็ตฟอร์ม
      setTitle("");
      setCategory("");
      setContent("");
      setErrors({});

      // นำทางไปหน้ารายการบทความหลังจากนั้น 1.5 วินาที
      setTimeout(() => {
        router.push("/posts");
        router.refresh();
      }, 1500);
    } catch (err) {
      setServerError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setTitle("");
    setCategory("");
    setContent("");
    setErrors({});
    setServerError("");
    setSuccessMessage("");
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
      {/* Tab Switcher: Mode แก้ไข vs Live Preview */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition ${
              activeTab === "edit"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            เขียนบทความ (Form)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition ${
              activeTab === "preview"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            <Eye className="w-4 h-4" />
            ดูตัวอย่าง (Live Preview)
          </button>
        </div>
        
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          ล้างฟอร์ม (Reset)
        </button>
      </div>

      {/* Global Alerts */}
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 rounded-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {serverError && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 rounded-2xl flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{serverError}</span>
        </div>
      )}

      {activeTab === "edit" ? (
        /* Form Edit Mode */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">
              หัวข้อบทความ (Title) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
              }}
              placeholder="เช่น การใช้งาน Next.js App Router เบื้องต้น"
              className={`w-full p-3 rounded-xl border ${
                errors.title
                  ? "border-rose-500 focus:ring-rose-500"
                  : "border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2`}
            />
            {errors.title && (
              <p className="mt-1 text-xs font-semibold text-rose-500">{errors.title}</p>
            )}
          </div>

          {/* Category & Author Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Select */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">
                หมวดหมู่ (Category) <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
                }}
                className={`w-full p-3 rounded-xl border ${
                  errors.category
                    ? "border-rose-500 focus:ring-rose-500"
                    : "border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2`}
              >
                <option value="">-- เลือกหมวดหมู่ --</option>
                <option value="Web Development">Web Development</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Data Science">Data Science</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-xs font-semibold text-rose-500">{errors.category}</p>
              )}
            </div>

            {/* Author Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">
                ชื่อผู้เขียน (Author) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                  if (errors.author) setErrors((prev) => ({ ...prev, author: "" }));
                }}
                placeholder="เช่น admin@tsu.ac.th"
                className={`w-full p-3 rounded-xl border ${
                  errors.author
                    ? "border-rose-500 focus:ring-rose-500"
                    : "border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2`}
              />
              {errors.author && (
                <p className="mt-1 text-xs font-semibold text-rose-500">{errors.author}</p>
              )}
            </div>
          </div>

          {/* Content Field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                เนื้อหาบทความ (Content) <span className="text-rose-500">*</span>
              </label>
              {/* Real-time Character Counter */}
              <span className="text-xs font-mono text-slate-400">
                {content.length} ตัวอักษร (ขั้นต่ำ 20)
              </span>
            </div>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) setErrors((prev) => ({ ...prev, content: "" }));
              }}
              placeholder="เขียนรายละเอียดเนื้อหาบทความที่นี่..."
              className={`w-full p-3 rounded-xl border ${
                errors.content
                  ? "border-rose-500 focus:ring-rose-500"
                  : "border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2`}
            />
            {errors.content && (
              <p className="mt-1 text-xs font-semibold text-rose-500">{errors.content}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? "กำลังเผยแพร่บทความ..." : "เผยแพร่บทความ (Submit)"}
          </button>
        </form>
      ) : (
        /* Live Preview Mode */
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50">
            <span className="text-xs font-mono text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
              {category || "ยังไม่ได้เลือกหมวดหมู่"}
            </span>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-3">
              {title || "ยังไม่ได้ระบุหัวข้อบทความ"}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              ผู้เขียน: {author || "ไม่ระบุ"} | วันที่: {new Date().toLocaleDateString()}
            </p>
            <div className="mt-4 text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed border-t border-slate-200 dark:border-slate-700 pt-4">
              {content || "ยังไม่มีเนื้อหาบทความ..."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
