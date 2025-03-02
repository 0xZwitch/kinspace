"use client";

import AppSidebar from '@/components/app-sidebar'
import { buttonVariants } from '@/components/ui/button'
import { SidebarInset } from '@/components/ui/sidebar'
import { useSpaceProgram } from '@/requests/space'
import Image from 'next/image'
import Link from 'next/link'

export default function Spacess() {
  const { accounts, getProgramAccount } = useSpaceProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="flex justify-center alert alert-info">
        <span>
          Program account not found.
        </span>
      </div>
    );
  }

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-8 pt-4 pl-4">
          <div className="grid gap-4 rounded-xl h-100">
            <div className="p-4 rounded-xl">
              <h3 className="text-4xl font-bold">Spaces</h3>
              <p className="text-sm mt-2 mb-4">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae nobis impedit commodi veniam numquam ducimus earum, temporibus praesentium, nemo perspiciatis dolores eligendi, et est volumtate incidunt sit officiis. Incidunt, quos?</p>
              <Link
                className={buttonVariants({ variant: "default", className: "rounded-xl" })}
                href="/spaces/create"
              >
                Create a Space
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 rounded-xl bg-muted/50 p-4 h-full">
              {
                accounts.isLoading ? (
                  <span className="loading loading-spinner loading-lg"></span>
                ) : accounts.data?.length ? (<>{accounts.data?.map((account) => (
                  <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-sm dark:bg-muted cursor-pointer" key={account.publicKey.toString()}>
                    <div className="relative">
                      <div className="relative h-56 w-full">
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
                  <div className="text-center">
                    <h2 className={"text-2xl"}>No space</h2>
                    No space found. Create one to get started.
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
