# Next.js AI SDK

## Configuration

```sh
pnpm add ai @ai-sdk/openai @ai-sdk/react zod 
```

## Generate text

The entire text will be generated at once.

```ts
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
```

## Streaming text

Starts showing text as soon as the API is generating it.

```ts
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
```

```tsx
"use client";

import { useCompletion } from "@ai-sdk/react";
import { FormEventHandler } from "react";

export default function CompletionStreamPage() {
  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    setInput,
  } = useCompletion({
    api: "/api/stream",
  });

  const onSubmit: FormEventHandler = e => {
    e.preventDefault();
    setInput(""); // temporary fix to clear the input after submission
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {error && <div className="text-red-500 mb-4">{error.message}</div>}
      {isLoading && !completion && <div>Loading...</div>}

      {completion && <div className="whitespace-pre-wrap">{completion}</div>}
      <form
        onSubmit={onSubmit}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        <div className="flex gap-2">
          <input
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
            value={input}
            onChange={handleInputChange}
            placeholder="How can I help you?"
          />
          {isLoading ? (
            <button
              onClick={stop}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Send
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
```

## Models and providers

- Text generation: LLMs like ChatGPT (OpenAI), Cluade (Anthropic) and Gemini (Google)
- Embedding: convert text into vectors
- Image: production and analysis
- Multi-modal

## Tokens

[OpenAI tokenizer](https://platform.openai.com/tokenizer)

- Basic unit of text processed by a model
- Tokenized differently by model and context

```ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const res = streamText({
      model: openai("gpt-4.1-nano"),
      prompt,
    });

    // Log the initial response
    const usage = await res.usage;
    console.info("Usage:", usage);

    return res.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming text", error);
    return NextResponse.json(
      { error: "Error streaming text" },
      { status: 500 }
    );
  }
}
```

## Prompt

- Each prompt is completly independent (incognito mode)
- No memory

```tsx
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

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming response:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
```