"use client";

import { useRouter } from "next/navigation";

const plans = [
  { name: "STARTER", credits: 100, price: "$9", color: "blue" },
  { name: "PRO", credits: 500, price: "$39", color: "purple" },
  { name: "INFINITE", credits: 2000, price: "$99", color: "green" },
];

export default function PricingPage() {
  const router = useRouter();

  const handlePurchase = async (credits: number) => {
    // 這裡之後會接 Stripe 或支付寶
    alert(`系統訊息：正在引導至加密支付通道... 購買 ${credits} 點數`);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-12 flex flex-col items-center">
      <button onClick={() => router.push("/")} className="fixed top-8 left-8 text-[10px] font-black text-neutral-600 hover:text-white tracking-[0.3em]">← BACK TO STATION</button>
      
      <header className="text-center mt-20 mb-16">
        <h2 className="text-5xl font-black tracking-tighter mb-4">CREDIT RELOAD</h2>
        <p className="text-neutral-500 text-xs tracking-[0.4em] uppercase">Fuel your interstellar intelligence</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {plans.map((plan) => (
          <div key={plan.name} className="p-8 bg-neutral-900/40 border border-neutral-800 rounded-[2.5rem] text-center hover:border-white/20 transition-all">
            <div className="text-xs font-black text-neutral-500 mb-2">{plan.name}</div>
            <div className="text-4xl font-black mb-6">⚡ {plan.credits}</div>
            <div className="text-2xl font-bold text-neutral-300 mb-8">{plan.price}</div>
            <button 
              onClick={() => handlePurchase(plan.credits)}
              className="w-full py-3 bg-white text-black font-black text-xs uppercase rounded-xl hover:bg-blue-600 hover:text-white transition-all"
            >
              Purchase Now
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}