import AppWalletProvider from "@/components/app-wallet-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
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
        {children}
      </SidebarProvider>
    </AppWalletProvider>
  );
}
