import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";

// Modern geometric sans-serif for clean, readable layout (like Elian Ross reference)
const plusJakarta = Plus_Jakarta_Sans({ 
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Luxury high-contrast editorial serif with gorgeous italics
const playfair = Playfair_Display({ 
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

// Playful handwritten script for editorial kickers & doodle accents
const caveat = Caveat({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chikal Nazmi Mahira | Business Development & Digital Strategist",
  description: "Portfolio of Chikal Nazmi Mahira. Specializing in Business Strategy, Operations, Partnerships, and Creative Digital Media.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`scroll-smooth ${plusJakarta.variable} ${playfair.variable} ${caveat.variable}`}>
      <body className="bg-[#FCFCFC] text-[#241C1E] font-sans antialiased selection:bg-rose-100 selection:text-rose-900">
        {children}
      </body>
    </html>
  );
}
