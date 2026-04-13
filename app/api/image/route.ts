import { NextResponse } from "next/server";
import Replicate from "replicate";
import OpenAI from "openai";

// 初始化客戶端
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt, model, image } = await req.json();

    // 1. 如果有上傳圖片 (以圖生圖模式)
    if (image) {
      console.log("偵測到圖片，啟動 Img2Img 模式...");
      
      // 使用最穩定的模型版本
      const output = await replicate.run(
        "lucataco/flux.1-dev-img2img:00f1352e800c01b44c6c06a86c624d077422f46849479b12853f56e54c034edc",
        {
          input: {
            prompt: prompt,
            image: image,         // 傳入 base64 圖片
            prompt_strength: 0.8,  // 強度
            num_inference_steps: 28,
            guidance_scale: 3.5
          }
        }
      );
      
      return NextResponse.json({ url: Array.isArray(output) ? output[0] : output });
    }

    // 2. 如果沒有圖片 (純文字生圖模式)
    console.log("純文字模式，模型:", model);

    // 如果是選 Nano 或 Seeddream 系列，走 OpenAI
    if (model.includes("Nano") || model.includes("Seeddream")) {
      const res = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
      });
      return NextResponse.json({ url: res.data[0].url });
    }

    // 其他模型走 Replicate 的文字生圖
    const textOutput = await replicate.run(
      "black-forest-labs/flux-1.1-pro",
      {
        input: {
          prompt: prompt,
          aspect_ratio: "1:1",
          output_format: "jpg"
        }
      }
    );

    return NextResponse.json({ url: Array.isArray(textOutput) ? textOutput[0] : textOutput });

  } catch (error: any) {
    // 這裡會把具體的錯誤原因印在你的 VS Code 終端機 (Terminal) 裡
    console.error("--- API 發生錯誤 ---");
    console.error("錯誤訊息:", error.message);
    
    // 如果是 Replicate 的 422 錯誤，通常是參數名稱對不上
    return NextResponse.json(
      { error: error.message || "AI 服務暫時無法回應" }, 
      { status: 500 }
    );
  }
}