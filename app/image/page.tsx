"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";

export default function ImagePage() {
  const [selectedModel, setSelectedModel] = useState("Nano Banana 2");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 精確抄襲 13 個 Image 模型清單
  const models = [
    "Nano Banana 2", "Nano Banana Pro", "Nano Banana", "Seeddream 5 Lite", 
    "Seeddream 4.5", "GPT Image 1.5", "Qwen Image 2.0", "Qwen Image", 
    "WAN 2.7", "WAN 2.6", "WAN 2.5", "FLUX 2 Klein", "Z-Image Turbo"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReferenceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult("");
    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: selectedModel, image: referenceImage }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResult(data.url);
    } catch (err: any) {
      alert("生成失敗: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* 精確抄襲頭部 */}
        <header className="flex items-center justify-between mb-16 pb-6 border-b border-neutral-800">
          <div>
            <Link href="/" className="text-neutral-500 hover:text-white transition inline-block font-bold tracking-widest text-xs uppercase">
              ← BACK TO STATION
            </Link>
            <h1 className="text-5xl font-black mt-2 tracking-tighter bg-gradient-to-r from-white to-neutral-600 bg-clip-text text-transparentuppercase">
              Image Generator
            </h1>
          </div>
          <div className="text-right text-[10px] font-black text-neutral-700 tracking-widest uppercase">
            Moonwalk Studio © 2026
          </div>
        </header>
        
        {/* 精確抄襲主要控制區 */}
        <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-[2.5rem] shadow-xl">
          <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3 block ml-2">Select Image Engine</label>
          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full bg-black border border-neutral-800 p-5 rounded-2xl mb-6 text-lg text-white outline-none focus:ring-1 focus:ring-blue-500">
            {models.map(m => <option key={m} value={m} className="bg-neutral-950 p-4">{m}</option>)}
          </select>

          {/* 新增功能：參考圖上傳 */}
          <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3 block ml-2">Reference Base (Image-to-Image)</label>
          <div className="flex gap-4 mb-6 items-center">
            <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs font-bold transition">
              {referenceImage ? "CHANGE PHOTO" : "UPLOAD REFERENCE"}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            {referenceImage && <div className="w-20 h-20 rounded-xl border-2 border-dashed border-blue-500 overflow-hidden shadow-lg"><img src={referenceImage} className="w-full h-full object-cover" /></div>}
          </div>

          <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3 block ml-2">Input Description / Modification Command</label>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe your vision or modification command..." className="w-full bg-black border border-neutral-800 p-6 rounded-3xl h-40 mb-6 text-xl outline-none focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed" />
          
          <button onClick={handleGenerate} disabled={isLoading || !prompt} className="w-full py-6 bg-white text-black font-black text-2xl rounded-full hover:bg-blue-600 hover:text-white transition-all disabled:bg-neutral-800 disabled:text-neutral-600">
            {isLoading ? "PROCESSING..." : referenceImage ? "MODIFY WITH AI" : "LAUNCH GENERATION"}
          </button>
        </div>

        {/* 結果展示 */}
        {result && (
          <div className="mt-12 p-4 bg-black border border-neutral-800 rounded-[2.5rem] shadow-2xl">
            <img src={result} className="w-full rounded-2xl" alt="result" />
          </div>
        )}
      </div>
    </main>
  );
}