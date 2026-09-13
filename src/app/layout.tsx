import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Caveat, Space_Mono } from "next/font/google";
import "./globals.css";

// Modern geometric sans-serif for clean, readable layout (Plus Jakarta Sans)
const plusJakarta = Plus_Jakarta_Sans({ 
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Luxury high-contrast editorial serif with gorgeous italics (Playfair Display)
const playfair = Playfair_Display({ 
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

// Playful handwritten script for editorial kickers & accents (Caveat)
const caveat = Caveat({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
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
    <html lang="id" className={`scroll-smooth scroll-pt-20 ${plusJakarta.variable} ${playfair.variable} ${caveat.variable} ${spaceMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Urbanist:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-sage-linen text-[#212B1E] font-sans antialiased selection:bg-rose-blush selection:text-rose-dark">
        {children}
      </body>
    </html>
  );
}

