"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";

export default function VideoPage() {
  const [selectedModel, setSelectedModel] = useState("Kling 3.0");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refImg, setRefImg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // 精確抄襲影片模型清單
  const models = ["WAN 2.7", "WAN 2.2 Spicy", "Kling 3.0", "Kling O3", "Sora 2", "Veo 3.1", "Vidu Q3", "Grok Imagine"];

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: selectedModel, image: refImg }),
      });
      const data = await res.json();
      setResult(data.url);
    } finally { setIsLoading(false); }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-16 pb-6 border-b border-neutral-800">
          <div>
            <Link href="/" className="text-neutral-500 hover:text-white transition mb-10 inline-block font-bold text-xs uppercase tracking-widest">← BACK TO STATION</Link>
            <h1 className="text-5xl font-black mt-2 tracking-tighter bg-gradient-to-r from-white to-neutral-600 bg-clip-text text-transparent uppercase">Video Generator</h1>
          </div>
          <div className="text-right text-[10px] font-black text-neutral-700 tracking-widest uppercase">Moonwalk Studio © 2026</div>
        </header>
        
        <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-[2.5rem]">
          <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3 block ml-2">Select Video Engine</label>
          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full bg-black border border-neutral-800 p-5 rounded-2xl mb-6">
            {models.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          {/* 新增功能：以圖生片上傳 */}
          <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3 block ml-2">Base Image for Animation</label>
          <div className="flex gap-4 mb-6 items-center">
            <button onClick={() => fileRef.current?.click()} className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs font-bold transition">UPLOAD PHOTO</button>
            <input type="file" ref={fileRef} onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setRefImg(reader.result as string);
                reader.readAsDataURL(file);
              }
            }} className="hidden" accept="image/*" />
            {refImg && <div className="w-20 h-20 rounded-xl border-2 border-dashed border-purple-500 overflow-hidden shadow-lg"><img src={refImg} className="w-full h-full object-cover" /></div>}
          </div>

          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the movement..." className="w-full bg-black border border-neutral-800 p-6 rounded-3xl h-40 mb-6 text-xl outline-none focus:ring-1 focus:ring-purple-500" />
          <button onClick={handleGenerate} className="w-full py-6 bg-purple-600 text-white font-black text-2xl rounded-full hover:bg-purple-500 transition-all">
            {isLoading ? "ANIMATING..." : "LAUNCH VIDEO"}
          </button>
        </div>
        {result && <div className="mt-12 p-4 bg-black border border-neutral-800 rounded-[2.5rem]"><video src={result} controls className="w-full rounded-2xl" /></div>}
      </div>
    </main>
  );
}