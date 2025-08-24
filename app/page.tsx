import Link from "next/link";

export default function Home() {
  const links = [
    {
      label: "Completions",
      href: "/ui/completion",
    },
    {
      label: "Stream Completions",
      href: "/ui/stream",
    },
    {
      label: "Chat Completions",
      href: "/ui/chat",
    },
  ];

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-semibold">OpenAI API</h1>
        <ul className="font-mono list-disc text-sm/6 text-center sm:text-left">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
