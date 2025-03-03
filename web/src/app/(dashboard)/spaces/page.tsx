"use client";

import Loader from '@/components/loader';
import { Button, buttonVariants } from '@/components/ui/button'
import { DEFAULT_PUBKEY, getKinspaceProgram } from '@/lib/exports';
import { useKinspaceProgram } from '@/requests/space'
import { mplTokenMetadata, fetchMasterEditionFromSeeds, printV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import { generateSigner, publicKey } from '@metaplex-foundation/umi';
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { BN } from '@coral-xyz/anchor';
import { toast } from 'sonner';
import Image from 'next/image'
import Link from 'next/link'
import { useAnchorProvider } from '@/components/use-anchor-provider';

export default function Spaces() {
  const wallet = useWallet();
  const provider = useAnchorProvider();
  const program = getKinspaceProgram(provider);
  const umi = createUmi('https://api.devnet.solana.com')
    .use(walletAdapterIdentity(wallet))
    .use(mplTokenMetadata())

  const { data, isLoading } = useQuery({
    queryKey: ["space", "all"],
    queryFn: () => program.account.spaceAccount.all(),
  });

  const { data: programData, isLoading: isLoadingProgram } = useKinspaceProgram();

  if (isLoadingProgram) {
    return <Loader className="mx-auto py-20" />;
  }
  if (!programData?.value) {
    return (
      <div className="flex justify-center alert alert-info">
        <span>
          Program account not found.
        </span>
      </div>
    );
  }

  const handleJoin = async ({ mint, creator }: { mint: PublicKey, creator: PublicKey }) => {
    try {
      console.log('mint', publicKey(mint))
      const masterEdition = await fetchMasterEditionFromSeeds(umi, {
        mint: publicKey(mint),
      })

      console.log('masterEdition', masterEdition)

      const masterTokenAccountOwner = generateSigner(umi);
      const editionMint = generateSigner(umi)
      const editionTokenAccountOwner = publicKey(creator)
      await printV1(umi, {
        masterTokenAccountOwner,
        masterEditionMint: masterEdition.publicKey,
        editionMint,
        editionTokenAccountOwner,
        editionNumber: masterEdition.supply + BN(1),
        tokenStandard: TokenStandard.NonFungible,
      }).sendAndConfirm(umi)

      toast("Mint success!", { description: `Mint Address: ${editionMint.publicKey}` })
      console.log("Mint Address: ", editionMint.publicKey);
    } catch (error) {
      toast("Mint failed.")
      console.log('error mint', error)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-8 pt-4 pl-4">
      <div className="grid gap-4 rounded-xl">
        <div className="p-4 rounded-xl">
          <h3 className="text-4xl font-bold">Spaces</h3>
          <p className="text-sm mt-2 mb-4">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae nobis impedit commodi veniam numquam ducimus earum, temporibus praesentium, nemo perspiciatis dolores eligendi, et est volumtate incidunt sit officiis. Incidunt, quos?</p>
          <Link
            className={buttonVariants({ variant: "default", className: "rounded-md" })}
            href="/create-space"
          >
            Create a Space
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4 rounded-xl bg-muted/50 p-4 h-full">
          {
            isLoading ? (
              <div className="col-start-2 mx-auto">
                <Loader />
              </div>
            ) : data?.length ? (<>{data?.map((account) => (
              <div className="text-left" key={account.publicKey.toString()}>
                <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-sm dark:bg-muted cursor-pointer">
                  <div className="relative">
                    <div className="relative h-64 w-full">
                      <Image
                        src="https://placehold.co/300x200.png"
                        alt="Card image"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-muted h-2/5 py-2 px-4">
                      <h3 className="text-md font-semibold">{account.account.name}</h3>
                      <p className="text-sm text-muted-foreground truncate mb-2">{account.account.description}</p>
                      <div className="flex justify-between">
                        <Button disabled={!wallet.connected || account.account.membershipMint.toString() === DEFAULT_PUBKEY} size="sm" onClick={() => handleJoin({
                          creator: account.account.creator,
                          mint: account.account.membershipMint,
                        })}>Join</Button>
                        <div className="text-sm">
                          {account.account.membershipMint.toString() === DEFAULT_PUBKEY && <span>Creator have not mint their token</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}</>
            ) : (
              <div className="text-center">
                <h2 className={"text-2xl"}>No space</h2>
                No space found. Create one to get started.
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
