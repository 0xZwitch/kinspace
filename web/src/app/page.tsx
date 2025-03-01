import { ModeToggle } from "@/components/theme-toggle";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <header className="ml-auto">
        <ModeToggle />
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex justify-center w-full">
          <Image
            className="dark:invert"
            src="/kinspace.svg"
            alt="Kinspace logo"
            width={180}
            height={38}
            priority
          />
        </div>
        <p className="text-wrap">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        <div className="flex justify-center w-full">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/home"
          >
            Get started
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p
          className="flex items-center"
        >
          *In Development
        </p>
      </footer>
    </div>
  );
}
