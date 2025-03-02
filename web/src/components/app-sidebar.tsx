import { FolderOpen, Home, Users } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"

const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Spaces",
    url: "/spaces",
    icon: Users,
  },
  {
    title: "My Spaces",
    url: "/my-spaces",
    icon: FolderOpen,
  },
]

export default function AppSidebar() {
  return (
    <Sidebar className="absolute top-16 sidebar-flat pl-4 pt-4" variant="floating">
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
  )
}
