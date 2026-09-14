import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="id" className="scroll-smooth scroll-pt-20">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Urbanist:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-sage-linen text-[#212B1E] font-sans antialiased selection:bg-rose-blush selection:text-rose-dark">
        {children}
      </body>
    </html>
  );
}


