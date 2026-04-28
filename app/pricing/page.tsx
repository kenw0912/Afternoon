"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";

// 初始化 Stripe 前端物件
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function PricingPage() {
  const { data: session } = useSession();

const handleCheckout = async () => {
  const res = await fetch("/api/checkout", {
    method: "POST",
  });

  const data = await res.json();

  // 🔥 直接跳轉（新版Stripe）
  window.location.href = data.url;
};

  return (
    <main className="min-h-screen bg-[#050505] text-white p-10 flex flex-col items-center">
      <h1 className="text-4xl font-black mb-12 tracking-tighter">SELECT PLAN</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* 點數方案卡片 */}
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[2rem] hover:border-blue-500 transition-all">
          <h2 className="text-xl font-bold mb-2">1000 Credits</h2>
          <p className="text-4xl font-black mb-6">$10.00 <span className="text-sm text-neutral-500">USD</span></p>
          <button 
            onClick={() => handleCheckout("price_1TQoKC21ghqLnLPEAUjtQ4LB")} // 請替換成 Stripe 的 price_...
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors"
          >
            立即購買
          </button>
        </div>
      </div>
    </main>
  );
}