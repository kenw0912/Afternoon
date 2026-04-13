import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function POST(req: Request) {
  try {
    const { prompt, model, image } = await req.json();

    const input: any = { prompt: prompt };
    if (image) input.image = image; // 將圖片設為影片的第一幀

    // 使用支援 Image-to-Video 的模型，例如 Luma Dream Machine 或 Kling 
    const output: any = await replicate.run(
      "lucataco/luma-dream-machine:0fc925f3c9e605d3ee0878e12089b3f364024479979c5b597c92b95b8602905a",
      { input }
    );

    return NextResponse.json({ url: output });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}