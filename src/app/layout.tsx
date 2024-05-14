import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import ConnectToMongoDB from '../config/ConnectToMongoDB';
import ThemeProvider from "@/providers/theme-provider";
import LayoutProvider from "@/providers/layout-provider";


// ConnectToMongoDB();
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Instagram Clone",
  description: "Made with love",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
     <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
         <LayoutProvider>
         {children} 
         </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
