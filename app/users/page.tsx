import type { Metadata } from "next";
import LikeButton from "../../components/LikeButton";
import { Users } from "lucide-react";

export const metadata: Metadata = {
  title: "รายชื่อผู้ใช้งาน | CIS Blog",
};

interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
  phone?: string;
  website?: string;
}

export default async function UsersPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    cache: "no-store",
  });
  const users: User[] = await res.json();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <span>รายชื่อผู้ใช้งาน</span>
            <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-mono font-semibold">
            // Fetching active API users
          </p>
        </div>
        <div className="glass-panel px-4 py-3 rounded-2xl border border-slate-300/80 dark:border-slate-700/80 shadow-sm">
          <LikeButton />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user: User) => {
          // Generate a soft gradient background for user avatar
          const gradients = [
            "from-indigo-500 to-cyan-500",
            "from-pink-500 to-rose-500",
            "from-purple-500 to-indigo-500",
            "from-emerald-500 to-teal-500",
            "from-amber-500 to-orange-500",
          ];
          const gradient = gradients[user.id % gradients.length];
          const initials = user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2);

          return (
            <div
              key={user.id}
              className="glass-panel p-6 rounded-3xl border border-slate-300/70 dark:border-slate-700/70 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 shadow-sm"
            >
              <div>
                {/* User avatar simulation */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center font-extrabold text-white shadow-md`}>
                    {initials}
                  </div>
                  <div>
                    <h2 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight line-clamp-1">
                      {user.name}
                    </h2>
                    <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 font-mono bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md inline-block mt-1">
                      ID: #{user.id}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span className="font-mono font-bold text-slate-500 dark:text-slate-400">Email:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[160px]">
                      {user.email}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span className="font-mono font-bold text-slate-500 dark:text-slate-400">Company:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[160px]">
                      {user.company.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex justify-between items-center text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                <span>Active User</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
