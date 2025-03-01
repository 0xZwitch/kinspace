import { Home, Users } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"

const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Spaces",
    url: "spaces",
    icon: Users,
  },
]

export default function AppSidebar() {
  return (
    <Sidebar className="absolute top-16 sidebar-flat pl-4 pt-2" variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
    // <nav>
    //   <ul className="space-y-2">
    //     <li>
    //       <Link href="/home" className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
    //         <Home className="h-5 w-5" />
    //         <span>Home</span>
    //       </Link>
    //     </li>
    //     <li>
    //       <Link href="/spaces" className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
    //         <Users className="h-5 w-5" />
    //         <span>Spaces</span>
    //       </Link>
    //     </li>
    //   </ul>
    // </nav>
  )
}
