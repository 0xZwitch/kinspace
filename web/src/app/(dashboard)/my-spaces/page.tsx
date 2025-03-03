"use client";

import Loader from '@/components/loader';
import { useAnchorProvider } from '@/components/use-anchor-provider';
import { getKinspaceProgram } from '@/lib/exports';
import { useKinspaceProgram } from '@/requests/space'
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image'
import { useRouter } from 'next/navigation';

export default function MySpaces() {
  const router = useRouter()
  const provider = useAnchorProvider();
  const program = getKinspaceProgram(provider);

  const { data, isLoading } = useQuery({
    queryKey: ["space", "owned"],
    queryFn: () => program.account.spaceAccount.all([
      {
        memcmp: {
          offset: 8, // skip discrimiator
          bytes: provider.wallet.publicKey.toBase58(),
        },
      },
    ]),
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

  return (
    <div className="flex flex-1 flex-col gap-4 p-8 pt-4 pl-4">
      <div className="grid gap-4 rounded-xl">
        <div className="p-4 rounded-xl">
          <h3 className="text-4xl font-bold">My Spaces</h3>
          <p className="text-sm mt-2 mb-4">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae nobis impedit commodi veniam numquam ducimus earum, temporibus praesentium, nemo perspiciatis dolores eligendi, et est volumtate incidunt sit officiis. Incidunt, quos?</p>
        </div>
        <div className="grid grid-cols-3 gap-4 rounded-xl bg-muted/50 p-4 h-full">
          {
            isLoading ? (
              <div className="col-start-2 mx-auto">
                <Loader />
              </div>
            ) : data?.length ? (<>{data?.map((account) => (
              <div
                className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-sm dark:bg-muted cursor-pointer"
                key={account.publicKey.toString()}
                onClick={() => router.push(`my-spaces/${account.publicKey.toString()}`)}
              >
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
                    <p className="text-sm text-muted-foreground truncate">{account.account.description}</p>
                  </div>
                </div>
              </div>
            ))}</>
            ) : (
              <div className="text-center col-start-2">
                <h2 className="text-xl">No space</h2>
                No space found. Create one to get started.
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
