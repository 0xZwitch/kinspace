"use client";

import SpaceForm from '@/components/space-form'
import { buttonVariants } from '@/components/ui/button'
import { SidebarInset } from '@/components/ui/sidebar'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateSpace() {
  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 px-4 py-10">
        <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50 py-4 px-8 justify-between items-center flex">
          <div className="flex justify-center items-center">
            <Link
              className={buttonVariants({ variant: "ghost" })}
              href="/spaces"
            >
              <ArrowLeft className="text-lg font-bold" />
            </Link>
          </div>
          <h1 className="text-lg font-bold">Create Space</h1>
        </div>
        <div className="mx-auto w-full max-w-3xl rounded-xl bg-muted/50">
          <SpaceForm />
        </div>
      </div>
    </SidebarInset>
  )
}
