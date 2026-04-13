import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt, model, image } = await req.json();

    const messages: any = [
      {
        role: "user",
        content: image 
          ? [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: image } } // 傳送 base64 圖片
            ]
          : prompt
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // 確保使用支援 Vision 的模型
      messages: messages,
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}