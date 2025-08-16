"use client";
import { useCompletion } from "@ai-sdk/react";
import { FormEventHandler, useCallback } from "react";

function CompletionStreamPage() {
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

  const renderButton = useCallback(() => {
    if (isLoading) {
      return (
        <button
          onClick={stop}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Stop
        </button>
      );
    }

    return (
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        Send
      </button>
    );
  }, [isLoading]);

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

          {renderButton()}
        </div>
      </form>
    </div>
  );
}

export default CompletionStreamPage;
