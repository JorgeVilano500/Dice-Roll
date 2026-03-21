import { Header, DiceRollingComponent } from "@/components";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col items-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 sm:mx-auto sm:w-full sm:max-w-3xl">
        <DiceRollingComponent />
      </main>
    </div>
  );
}
