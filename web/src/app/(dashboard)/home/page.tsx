import Navigation from '@/components/app-navigation'
import React from 'react'

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-8 pt-0">
      <div className="grid gap-4 grid-cols-6">
        <div className="rounded-md">
          <Navigation />
        </div>
        <div className="aspect-video rounded-md bg-muted/50 col-span-3" />
        <div className="aspect-video rounded-md bg-muted/50 col-span-2" />
      </div>
    </div>
  )
}
