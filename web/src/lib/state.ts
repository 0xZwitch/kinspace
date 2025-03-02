import { PublicKey } from "@solana/web3.js"
import IDL from "./kinspace.json"

const IDL_STRING = JSON.stringify(IDL)
export const IDL_OBJECT = JSON.parse(IDL_STRING)
export const PROGRAM_ID = new PublicKey(IDL.address)
