import type { Metadata } from "next";
import { Outfit, Instrument_Serif } from "next/font/google";
import "./globals.css";

// Modern geometric sans-serif (Elian Ross body, headings, and pills)
const outfit = Outfit({ 
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Slender, luxury high-contrast editorial serif (Elian Ross title, kickers, and giant footer)
const instrumentSerif = Instrument_Serif({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
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
    <html lang="id" className={`scroll-smooth ${outfit.variable} ${instrumentSerif.variable}`}>
      <body className="bg-[#FCFCFC] text-[#18181B] font-sans antialiased selection:bg-teal-100 selection:text-teal-900">
        {children}
      </body>
    </html>
  );
}

