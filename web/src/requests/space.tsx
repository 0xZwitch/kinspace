"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { IDL_OBJECT, PROGRAM_ID } from "@/lib/state";
import { Kinspace } from "@/lib/kinspace";
import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';

export function useSpaceProgram() {
  const wallet = useWallet()
  const { connection } = useConnection();
  const provider = new AnchorProvider(connection, wallet as unknown as Wallet, AnchorProvider.defaultOptions());
  const programId = PROGRAM_ID
  const program = new Program<Kinspace>(IDL_OBJECT, provider)

  const accounts = useQuery({
    queryKey: ["space", "all"],
    queryFn: () => program.account.spaceAccount.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account"],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
  };
};
