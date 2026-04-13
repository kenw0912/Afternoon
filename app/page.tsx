"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    // 移除 items-center，改用相對定位
    <main className="min-h-screen bg-[#050505] text-white flex flex-col p-6 font-sans relative overflow-hidden">
      
      {/* --- 右上角導覽列 --- */}
      <nav className="absolute top-8 right-8 z-50">
{session ? (
  <div className="flex items-center gap-4 bg-neutral-900/60 backdrop-blur-md p-2 pl-4 pr-2 border border-neutral-800 rounded-full shadow-2xl">
    <div className="flex flex-col items-end">
      <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Operator</span>
      <span className="text-sm font-bold text-white/90">{session.user?.name}</span>
    </div>
    {/* 儲值按鈕連結 */}
    <Link href="/pricing">
      <div className="bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700 cursor-pointer hover:border-blue-500 transition-all">
         <span className="text-xs font-black text-blue-400 tracking-tighter">
           ⚡ {(session.user as any)?.credits ?? 0} <span className="text-[8px] text-neutral-500">CR</span>
         </span>
      </div>
    </Link>
    <button onClick={() => signOut()} className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-red-500/20 hover:text-red-500 border border-neutral-700">
      <span className="text-[10px]">✕</span>
    </button>
  </div>
) : (
  <Link href="/auth/signin">
    <button className="px-6 py-2 bg-white text-black font-black text-xs uppercase rounded-full">SIGN IN</button>
  </Link>
)}
      </nav>

      {/* --- 中間主內容區 --- */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <header className="text-center mb-20">
          <h1 className="text-7xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
            MOONWALK
          </h1>
          <p className="text-neutral-500 uppercase tracking-[0.5em] text-xs font-bold">Interstellar Intelligence Station</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {/* 圖片入口 */}
          <Link href="/image" className="group relative p-12 bg-neutral-900/40 border border-neutral-800 rounded-[3rem] hover:border-blue-500/50 transition-all text-center overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500">🖼️</div>
            <div className="text-2xl font-black tracking-widest mb-2">IMAGE</div>
            <p className="text-neutral-500 text-sm">Nano Banana / FLUX / WAN</p>
          </Link>

          {/* 影片入口 */}
          <Link href="/video" className="group relative p-12 bg-neutral-900/40 border border-neutral-800 rounded-[3rem] hover:border-purple-500/50 transition-all text-center overflow-hidden">
            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500">🎬</div>
            <div className="text-2xl font-black tracking-widest mb-2">VIDEO</div>
            <p className="text-neutral-500 text-sm">Kling / Sora / Veo</p>
          </Link>

          {/* 文字入口 */}
          <Link href="/text" className="group relative p-12 bg-neutral-900/40 border border-neutral-800 rounded-[3rem] hover:border-green-500/50 transition-all text-center overflow-hidden">
            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500">✍️</div>
            <div className="text-2xl font-black tracking-widest mb-2">TEXT</div>
            <p className="text-neutral-500 text-sm">ChatGPT / Gemini / Grok</p>
          </Link>
        </div>
      </div>

      <footer className="w-full text-center py-10 text-neutral-700 text-[10px] font-black tracking-[0.2em] uppercase">
        System: {session ? "Access Granted" : "Awaiting Authorization"} | Latency: 24ms © 2026 Moonwalk Studio
      </footer>
    </main>
  );
}