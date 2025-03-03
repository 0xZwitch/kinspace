"use client";

import { useAnchorProvider } from '@/components/use-anchor-provider';
import { Button } from '@/components/ui/button'
import { SidebarInset } from '@/components/ui/sidebar'
import { DEFAULT_PUBKEY, getKinspaceProgram } from '@/lib/exports';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { use } from 'react';
import MintMembershipDialog from '@/components/mint-membership-dialog';

export default function SpaceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const provider = useAnchorProvider();
  const program = getKinspaceProgram(provider);

  const { data } = useQuery({
    queryKey: ["space", "detail", id],
    queryFn: async () => await program.account.spaceAccount.fetch(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
  });

  return (
    <SidebarInset>
      <div className="grid grid-flow-col grid-rows-12 grid-cols-3 gap-4 w-full p-8">
        <div className="row-span-2 col-span-2 rounded-xl bg-muted/50">
          <div className="mx-auto h-24 py-4 px-8 justify-between items-center flex">
            <div className="flex justify-center items-center">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="text-lg font-bold" />
              </Button>
            </div>
            <h1 className="text-lg font-bold">{data?.name ?? "Space Name"}</h1>
          </div>
        </div>
        <div className="row-span-10 col-span-2 p-8 rounded-xl bg-muted/50"></div>
        <div className="row-span-4 rounded-xl bg-muted/50">
          <div className="flex justify-center">
            {data?.membershipMint.toString() === DEFAULT_PUBKEY ? (
              <div className="flex-col p-8">
                <div className="text-sm text-wrap mb-4">This space does not have assigned membership mint yet. You need membership mint to invite others to your space.</div>
                <MintMembershipDialog spaceAddress={id} />
              </div>
            ) : (
              <div className="flex-col p-8">
                <div className="text-sm font-bold">Membership Mint</div>
                <div className="text-sm">{data?.membershipMint.toString()}</div>
              </div>
            )}
          </div>
        </div>
        <div className="row-span-8 rounded-xl bg-muted/50"></div>
      </div>
    </SidebarInset>
  )
}
