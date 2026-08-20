"use client";
import {useState} from "react";
export default function WarmupPage() {
    const [text, setText] = useState("");
    return (
        <div className="p-8">
            <input value={text} onChange={(e) => setText(e.target.value)} className="border border-gray-400 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <p>พิมพ์ว่า: {text}</p>
        </div>
    );
}
