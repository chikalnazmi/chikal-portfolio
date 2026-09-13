import type { Metadata } from "next";
import { Lora, Jost, Source_Sans_3, Space_Mono } from "next/font/google";
import "./globals.css";

// Title Styling: Quincy (with Google Font Lora as warm editorial serif equivalent & local Quincy CF support)
const quincy = Lora({ 
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-quincy",
  display: "swap",
  style: ["normal", "italic"]
});

// Subheader Styling: Futura (with Google Font Jost as geometric sans counterpart & system Futura support)
const futura = Jost({ 
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-futura",
  display: "swap",
});

// Paragraph Styling: Source Sans (Source Sans 3)
const sourceSans = Source_Sans_3({ 
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chikal Nazmi Mahira | Business Development & Marketing Strategist",
  description: "Portfolio of Chikal Nazmi Mahira. Specializing in Business Development, Strategic Partnerships, Operations, and Marketing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`scroll-smooth ${quincy.variable} ${futura.variable} ${sourceSans.variable} ${spaceMono.variable}`}>
      <body className="bg-[#E8EFE5] text-[#212B1E] font-sans antialiased selection:bg-rose-blush selection:text-rose-dark">
        {children}
      </body>
    </html>
  );
}
