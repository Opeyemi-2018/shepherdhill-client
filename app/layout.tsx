import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import TopLoader from "@/components/LoadingBar";
import { AuthProvider } from "@/context/AuthContext";


export const metadata: Metadata = {
  title: "Shepherd Hill Client",
  description: "Client dashboard",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
      <body
          className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
        <TopLoader />

        <Toaster richColors position="top-center" />
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
      </body>
      </html>
  );
}