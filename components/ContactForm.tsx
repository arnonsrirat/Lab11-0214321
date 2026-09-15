"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const tags = [
    { value: "question", label: "คำถาม" },
    { value: "feedback", label: "ข้อเสนอแนะ" },
    { value: "bug", label: "แจ้งปัญหา" },
] as const;

export default function ContactForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [tag, setTag] = useState("");
    const [error, setError] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const isValid = name.trim().length >= 2 && email.includes("@") && message.trim().length >= 5 && tag !== "";

    function validate() {
        if (name.trim().length < 2) return "กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร";
        if (!email.includes("@")) return "อีเมลไม่ถูกต้อง";
        if (message.trim().length < 5) return "ข้อความสั้นเกินไป";
        if (!tag) return "กรุณาเลือกประเภทข้อความ";
        return "";
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        setStatus("sending");
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message, tag }),
        });

        if (!response.ok) {
            setStatus("error");
            return;
        }

        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
        setTag("");
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="ชื่อ" className="border p-2 w-full rounded" />
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="อีเมล" className="border p-2 w-full rounded" />
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="ข้อความ" className="border p-2 w-full rounded" />
            <select value={tag} onChange={(event) => setTag(event.target.value)} className="border p-2 w-full rounded" aria-label="ประเภทข้อความ">
                <option value="">เลือกประเภทข้อความ</option>
                {tags.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={!isValid || status === "sending"} className={isValid ? "bg-blue-600 text-white px-4 py-2 rounded" : "bg-gray-300 px-4 py-2 rounded"}>
                ส่งข้อความ
            </button>
            {status === "sending" && <p className="text-gray-400">กำลังส่ง...</p>}
            {status === "success" && <p className="text-green-600">ส่งสำเร็จ ขอบคุณครับ!</p>}
            {status === "error" && <p className="text-red-600">ส่งไม่สำเร็จ ลองใหม่อีกครั้ง</p>}
        </form>
    );
}
