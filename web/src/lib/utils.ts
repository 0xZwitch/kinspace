import { PublicKey } from "@solana/web3.js";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSpaceAddress(name: string, creator: PublicKey, programId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("space"), creator.toBuffer(), Buffer.from(name)],
    programId
  );
}
