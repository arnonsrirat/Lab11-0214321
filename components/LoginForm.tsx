"use client"; // ← บรรทัดแรกเสมอ
import { useState } from "react";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    // ตรวจสอบความถูกต้องเบื้องต้น (อีเมลมี @ และ รหัสผ่านอย่างน้อย 6 ตัว)
    const isValid = email.includes("@") && password.length >= 6;

    function validate() {
        if (!email.includes("@")) return "กรุณากรอกอีเมลให้ถูกต้อง";
        if (password.length < 6) return "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
        return "";
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const msg = validate();
        if (msg) {
            setError(msg);
            return;
        }

        setError("");
        setStatus("submitting");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                setStatus("error");
                return;
            }

            setStatus("success");
            setEmail("");
            setPassword("");
        } catch (err) {
            setStatus("error");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">เข้าสู่ระบบ</h2>

            <div>
                <label className="block text-sm font-medium mb-1">อีเมล</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">รหัสผ่าน</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* แสดงการแจ้งเตือน Validation Error */}
            {error && <p className="text-red-600 text-sm">{error}</p>}

            {/* ปุ่มเข้าสู่ระบบ */}
            <button
                type="submit"
                disabled={!isValid || status === "submitting"}
                className={`w-full p-2 rounded text-white font-medium transition ${
                    isValid && status !== "submitting"
                        ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        : "bg-gray-300 cursor-not-allowed"
                }`}
            >
                เข้าสู่ระบบ
            </button>

            {/* สถานะการทำงาน */}
            {status === "submitting" && <p className="text-gray-400 text-sm text-center">กำลังเข้าสู่ระบบ...</p>}
            {status === "success" && <p className="text-green-600 text-sm text-center">เข้าสู่ระบบสำเร็จ!</p>}
            {status === "error" && <p className="text-red-600 text-sm text-center">อีเมลหรือรหัสผ่านไม่ถูกต้อง</p>}
        </form>
    );
}