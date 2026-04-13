import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // 1. Get user input (prompt) from the frontend
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // 2. Call OpenAI DALL-E 3 API
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    // 3. Extract the image URL
    const imageUrl = response.data[0].url;

    // 4. Return the result back to the frontend
    return NextResponse.json({ url: imageUrl });

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    
    // Standard error handling
    return NextResponse.json(
      { error: "Failed to generate image. Please check your API credits." },
      { status: 500 }
    );
  }
}