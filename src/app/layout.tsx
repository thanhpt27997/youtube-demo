import type { Metadata } from "next";
import "./globals.css";
import ClientSessionProvider from "./session-provider/page";
import Header from "@/components/header";


export const metadata: Metadata = {
  title: 'YouTube API App Demo',
  description: 'Ứng dụng sử dụng YouTube API',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientSessionProvider>
          <Header />
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  );
}
