import { NextResponse } from "next/server";

// 根據日誌確認過的模型路徑對應表
const modelMapping: { [key: string]: string } = {
  "WAN 2.7": "wanvgi/wan-v2.1-t2v-720p",
  "WAN 2.2 Spicy": "wanvgi/wan-v2.1-s2v-720p",
  "Kling 3.0": "wavespeed-ai/hunyuan-video/t2v", 
  "Hunyuan Video": "wavespeed-ai/hunyuan-video/t2v",
  "Sora 2": "openai/sora",
  "Veo 3.1": "google/veo-v1",
  "Vidu Q3": "shengshuvgi/vidu-v1.5",
  "Grok Imagine": "xai/grok-vision-v1"
};

export async function POST(req: Request) {
  try {
    const { prompt, model, image } = await req.json();
    const modelPath = modelMapping[model] || "wavespeed-ai/hunyuan-video/t2v";
    const WAVESPEED_API_URL = `https://api.wavespeed.ai/api/v3/${modelPath}`;

    const response = await fetch(WAVESPEED_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.WAVESPEED_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        size: "1280*720", 
        image_url: image || null 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // 捕捉點數不足或其他 API 錯誤
      console.error("API 報錯內容:", data);
      return NextResponse.json({ error: data.message || "Model request error" }, { status: response.status });
    }

    return NextResponse.json({ id: data.data?.id || data.id });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 核心修正：加入代理機制解決 401 播放問題
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const stream = searchParams.get("stream"); // 用於播放器的二進制流

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    // 1. 向 Wavespeed 查詢狀態
    const response = await fetch(`https://api.wavespeed.ai/api/v3/predictions/${id}/result`, {
      headers: { "Authorization": `Bearer ${process.env.WAVESPEED_API_KEY}` },
    });
    
    const data = await response.json();
    const status = (data.data?.status || data.status || "").toLowerCase();
    const videoUrl = data.data?.urls?.get || data.output?.url || data.data?.url;

    // 💡 廣義成功判斷
    const isFinished = ["success", "succeeded", "completed"].includes(status);

    if (isFinished && videoUrl) {
      // 如果帶有 stream 參數，代表是要給 <video> 標籤播放的
      if (stream === "true") {
        const videoRes = await fetch(videoUrl, {
          headers: { "Authorization": `Bearer ${process.env.WAVESPEED_API_KEY}` },
        });
        const buffer = await videoRes.arrayBuffer();
        
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": "video/mp4",
            "Content-Disposition": "inline",
            "Cache-Control": "public, max-age=3600"
          },
        });
      }

      // 如果只是輪詢狀態，回傳一個指向自身 API 的「代理網址」
      return NextResponse.json({ 
        status: "completed", 
        url: `/api/generate/video?id=${id}&stream=true` 
      });
    }

    if (status === "failed" || status === "error") {
      return NextResponse.json({ status: "failed" });
    }

    return NextResponse.json({ status: "processing" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}