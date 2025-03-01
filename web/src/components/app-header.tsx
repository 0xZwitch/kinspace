"use client"

import Image from "next/image";
import { ModeToggle } from "./theme-toggle"
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function Header() {
  return (
    <div className="flex items-center justify-between h-16 px-8">
      <Image
        className="dark:invert"
        src="/kinspace.svg"
        alt="Kinspace logo"
        width={187}
        height={36}
        priority
      />
      <div className="flex items-center space-x-4">
        <WalletMultiButtonDynamic style={{ borderRadius: 1 }} />
        <ModeToggle />
      </div>
    </div>
  )
}

