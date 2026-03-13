import Image from "next/image";
import { Header, DiceRollingComponent } from "@/components";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      
        <Header />
      <main className="flex min-h-[25rem] w-full max-w-3xl flex-col items-center justify-between items-stretch  bg-white dark:bg-black sm:items-start">
        <DiceRollingComponent />    
      </main>
    </div>
  );
}
