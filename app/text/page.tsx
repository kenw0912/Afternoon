import { NextResponse } from "next/server";
import Replicate from "replicate";
import OpenAI from "openai";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt, model, image } = await req.json();

    // 如果有圖片，進入「以圖生圖」模式
    if (image) {
      // 使用支援 img2img 的模型，例如 FLUX.1-dev
      const output: any = await replicate.run(
        "lucataco/flux.1-dev-img2img:00f1352e800c01b44c6c06a86c624d077422f46849479b12853f56e54c034edc",
        {
          input: {
            prompt: prompt,
            image: image, // 這裡是前端傳來的 base64
            strength: 0.6, // 對原圖的修改強度
            num_outputs: 1
          }
        }
      );
      return NextResponse.json({ url: Array.isArray(output) ? output[0] : output });
    }

    // 否則進入標準「文字生圖」模式
    // 這裡保留你原本 DALL-E 3 或其他模型的邏輯
    const res = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
    });
    return NextResponse.json({ url: res.data[0].url });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}