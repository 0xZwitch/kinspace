"use client";

import { useConnection } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { KINSPACE_PROGRAM_ID } from "@/lib/exports";

export function useKinspaceProgram() {
  const { connection } = useConnection();

  // const accounts = useQuery({
  //   queryKey: ["space", "all"],
  //   queryFn: () => program.account.spaceAccount.all(),
  // });

  // const ownedAccounts = useQuery({
  //   queryKey: ["space", "owned"],
  //   queryFn: () => program.account.spaceAccount.all([
  //     {
  //       memcmp: {
  //         offset: 8, // skip discrimiator
  //         bytes: provider.wallet.publicKey.toBase58(),
  //       },
  //     },
  //   ]),
  // });

  return useQuery({
    queryKey: ["get-program-account"],
    queryFn: () => connection.getParsedAccountInfo(KINSPACE_PROGRAM_ID),
  });
};
