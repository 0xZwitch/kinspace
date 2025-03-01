import AppWalletProvider from "@/components/app-wallet-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import Header from "@/components/app-header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppWalletProvider>
      <Header />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-8 pt-4 pl-4">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AppWalletProvider>
  );
}
