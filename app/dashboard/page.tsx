import { getMessages } from "@/lib/messages";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const messages = await getMessages();

    return (
        <main className="max-w-4xl mx-auto p-8 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">ต้อง Login ก่อนถึงจะเห็นหน้านี้ได้</p>
                </div>
                <LogoutButton />
            </div>

            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-blue-900 mb-1">ข้อความติดต่อ (Contact Messages)</h2>
                <p className="text-2xl font-bold text-blue-600">
                    จํานวนข้อความที่ได้รับ: {messages.length} ข้อความ
                </p>
            </div>

            {messages.length > 0 ? (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">รายการข้อความล่าสุด</h3>
                    <div className="divide-y border rounded-lg overflow-hidden bg-white">
                        {messages.map((msg) => (
                            <div key={msg.id} className="p-4 space-y-1">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-800">{msg.name} ({msg.email})</span>
                                    <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="text-gray-600 text-sm">{msg.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center p-8 border rounded-lg bg-gray-50 text-gray-500">
                    ยังไม่มีข้อความติดต่อในระบบ
                </div>
            )}
        </main>
    );
}
