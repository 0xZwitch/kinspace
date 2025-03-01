import AppWalletProvider from "@/components/app-wallet-provider";
import Header from "@/components/app-header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppWalletProvider>
      <Header />
      {children}
    </AppWalletProvider>
  );
}
