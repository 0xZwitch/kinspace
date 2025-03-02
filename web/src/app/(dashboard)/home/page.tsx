export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-8 pt-4 pl-4">
      <div className="grid gap-8 grid-cols-5">
        <div className="aspect-auto rounded-xl bg-muted/50 col-span-3" />
        <div className="aspect-video rounded-xl bg-muted/50 col-span-2" />
      </div>
    </div>
  )
}
