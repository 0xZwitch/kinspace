import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex-col space-y-4 text-center">
        <h2 className="text-lg font-semibold">Page Not Found</h2>
        <p>Could not find requested resource</p>
        <Link className={buttonVariants({ variant: "default" })} href="/home">
          Return Home
        </Link>
      </div>
    </div>
  );
}
