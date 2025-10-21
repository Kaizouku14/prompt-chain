import { ModeToggle } from "@/components/theme/toggler";
import Home from "./home/page";

export default function Main() {
  return (
    <main className="relative mx-auto flex h-screen w-full items-center justify-center p-4">
      <Home />
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
    </main>
  );
}
