import AppSidebar from '@/components/app-sidebar'
import { Button, buttonVariants } from '@/components/ui/button'
import { SidebarInset } from '@/components/ui/sidebar'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Spacess() {
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
            <div className="grid grid-cols-3 gap-4 rounded-xl bg-muted/50 p-4">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-sm dark:bg-muted">
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
                    <h3 className="text-md font-semibold">Space Name</h3>
                    <p className="text-sm text-muted-foreground">This is a description of the space.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">$0.99</span>
                      <Button variant={"link"} size={"sm"}>Buy Membership</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-sm dark:bg-muted">
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
                    <h3 className="text-md font-semibold">Space Name</h3>
                    <p className="text-sm text-muted-foreground">This is a description of the space.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">$0.99</span>
                      <Button variant={"link"} size={"sm"}>Buy</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-sm dark:bg-muted">
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
                    <h3 className="text-md font-semibold">Space Name</h3>
                    <p className="text-sm text-muted-foreground">This is a description of the space.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">$0.99</span>
                      <Button variant={"link"} size={"sm"}>Buy</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-sm dark:bg-muted">
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
                    <h3 className="text-md font-semibold">Space Name</h3>
                    <p className="text-sm text-muted-foreground">This is a description of the space.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">$0.99</span>
                      <Button variant={"link"} size={"sm"}>Buy</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
