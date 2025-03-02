import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Kinspace } from "./kinspace";
import KINSPACE_IDL from "./kinspace.json";

const IDL_STRING = JSON.stringify(KINSPACE_IDL);
export const IDL_OBJECT = JSON.parse(IDL_STRING);
export const KINSPACE_PROGRAM_ID = new PublicKey(KINSPACE_IDL.address);
export const DEFAULT_PUBKEY = "11111111111111111111111111111111";

export function getKinspaceProgram(provider: AnchorProvider) {
  return new Program(KINSPACE_IDL as Kinspace, provider);
}

export { KINSPACE_IDL };