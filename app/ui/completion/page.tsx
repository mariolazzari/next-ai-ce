"use client";
import { FormEventHandler, useCallback, useState } from "react";

function CompletionPage() {
  const [prompt, setPrompt] = useState("");
  const [completion, setCompletion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setPrompt("");
    setCompletion("");
  };

  const complete: FormEventHandler = async e => {
    e.preventDefault();
    setLoading(true);
    reset();

    try {
      const res = await fetch("/api/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const { text } = await res.json();
      setCompletion(text);
      setError("");
    } catch (ex) {
      const err =
        ex instanceof Error ? ex.message : "Error fetching completion";
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const renderCompletion = useCallback(() => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (completion) {
      return <div className="whitespace-pre-wrap">{completion}</div>;
    }

    return null;
  }, [loading, completion]);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {renderCompletion()}

      <form
        onSubmit={complete}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        <div className="flex gap-2">
          <input
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
            type="How can I help you?"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default CompletionPage;
