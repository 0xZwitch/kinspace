import AppSidebar from '@/components/app-sidebar'
import { SidebarInset } from '@/components/ui/sidebar'
import React from 'react'

export default function Dashboard() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-8 pt-4 pl-4">
          <div className="grid gap-8 grid-cols-5">
            <div className="aspect-video rounded-xl bg-muted/50 col-span-3" />
            <div className="aspect-video rounded-xl bg-muted/50 col-span-2" />
          </div>
        </div>
      </SidebarInset></>
  )
}
