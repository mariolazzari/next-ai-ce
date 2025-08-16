import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const res = streamText({
      model: openai("gpt-3.5-turbo"),
      prompt,
    });

    return res.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming text", error);
    return NextResponse.json(
      { error: "Error streaming text" },
      { status: 500 }
    );
  }
}
