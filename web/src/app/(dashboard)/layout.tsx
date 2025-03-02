import AppWalletProvider from "@/components/solana-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/app-header";
import AppSidebar from "@/components/app-sidebar";

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
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AppWalletProvider>
  );
}
