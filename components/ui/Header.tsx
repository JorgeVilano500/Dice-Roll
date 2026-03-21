import { ThemeToggle } from "@/components";

function Header() {
  return (
    <header className="shrink-0 w-full px-4 py-3 sm:max-w-3xl sm:mx-auto sm:my-2 flex items-center justify-between">
      <h1 className="text-2xl font-bold">Roll the Dice!</h1>
      <ThemeToggle />
    </header>
  );
}

export default Header;