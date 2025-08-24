import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    const result = streamText({
      model: openai("gpt-4.1-nano"),
      messages: convertToModelMessages(messages),
    });

    const usage = await result.usage;
    console.log("Usage:", usage);

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming response:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
