import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/shared/CustomCursor";
import FallingFlowers from "@/components/shared/FallingFlowers";

const fraunces = Fraunces({ 
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chikal Nazmi Mahira | Portfolio",
  description: "Business Development, Marketing & Growth Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${fraunces.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <body>
        <CustomCursor />
        <FallingFlowers />
        {children}
      </body>
    </html>
  );
}
