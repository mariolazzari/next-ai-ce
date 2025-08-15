import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const { text } = await generateText({
      model: openai("gpt-4.1-nano"),
      prompt,
    });

    return NextResponse.json({ text });
  } catch (ex) {
    const error = ex instanceof Error ? ex.message : "Error fetching text";

    return NextResponse.json({ error }, { status: 500 });
  }
}
