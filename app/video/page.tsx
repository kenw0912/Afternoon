"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function VideoPage() {
  const [selectedModel, setSelectedModel] = useState("Kling 3.0");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [refImg, setRefImg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<any>(null);

  const models = ["WAN 2.7", "WAN 2.2 Spicy", "Kling 3.0", "Kling O3", "Sora 2", "Veo 3.1", "Vidu Q3", "Grok Imagine"];

  useEffect(() => {
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  const handleGenerate = async () => {
    if (!prompt) return alert("Please enter a description");
    setIsLoading(true);
    setResult("");
    setStatusText("Initializing engine...");

    try {
      const res = await fetch("/api/generate/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: selectedModel, image: refImg }),
      });
      
      const data = await res.json();
      const taskId = data.id;

      if (!taskId) throw new Error("Failed to start task");

      setStatusText("Animating... (approx 1-3 mins)");
      
      // 💡 每 5 秒自動跑後端問一次結果
      pollingRef.current = setInterval(async () => {
        const statusRes = await fetch(`/api/generate/video?id=${taskId}`);
        const statusData = await statusRes.json();

        if (statusData.status === "completed") {
          clearInterval(pollingRef.current);
          setResult(statusData.url); // 💡 觸發顯示影片
          setIsLoading(false);
          setStatusText("Success!");
        } else if (statusData.status === "failed") {
          clearInterval(pollingRef.current);
          alert("Generation failed on server.");
          setIsLoading(false);
        }
      }, 5000);

    } catch (err: any) {
      alert(err.message);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-16 pb-6 border-b border-neutral-800">
          <div>
            <Link href="/" className="text-neutral-500 hover:text-white transition mb-10 inline-block font-bold text-xs uppercase tracking-widest">← BACK TO STATION</Link>
            <h1 className="text-5xl font-black mt-2 tracking-tighter bg-gradient-r from-white to-neutral-600 bg-clip-text text-transparent uppercase">Video Generator</h1>
          </div>
          <div className="text-right text-[10px] font-black text-neutral-700 tracking-widest uppercase">Moonwalk Studio © 2026</div>
        </header>
        
        <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-[2.5rem]">
          <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3 block ml-2">Select Video Engine</label>
          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full bg-black border border-neutral-800 p-5 rounded-2xl mb-6">
            {models.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

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
            {refImg && <div className="w-20 h-20 rounded-xl border border-purple-500 overflow-hidden"><img src={refImg} className="w-full h-full object-cover" /></div>}
          </div>

          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the movement..." className="w-full bg-black border border-neutral-800 p-6 rounded-3xl h-40 mb-6 text-xl outline-none focus:ring-1 focus:ring-purple-500" />
          <button onClick={handleGenerate} disabled={isLoading} className={`w-full py-6 font-black text-2xl rounded-full transition-all ${isLoading ? 'bg-neutral-800 text-neutral-500' : 'bg-purple-600 hover:bg-purple-500'}`}>
            {isLoading ? "ANIMATING..." : "LAUNCH VIDEO"}
          </button>
          {isLoading && <p className="text-center mt-4 text-[10px] font-black text-purple-400 tracking-widest animate-pulse">{statusText}</p>}
        </div>

        {/* 💡 這裡會根據成功後的網址自動顯示影片 */}
        {result && (
          <div className="mt-12 p-4 bg-black border border-neutral-800 rounded-[2.5rem]">
            <video src={result} controls autoPlay loop className="w-full rounded-2xl" />
            <div className="flex justify-between mt-4 px-4">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Render Success</span>
              <a href={result} download className="text-[10px] font-black text-purple-500 hover:text-white uppercase">Download MP4</a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
