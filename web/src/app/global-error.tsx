"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex-col space-y-4 text-center">
        <h2 className="text-lg font-semibold">Something went wrong!</h2>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
