import type { Metadata, Viewport } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-playfair" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "Liliana Miranda · La Academia",
  description: "Aprende a preparar impuestos con Liliana Miranda, en tu idioma.",
  appleWebApp: { capable: true, title: "La Academia", statusBarStyle: "default" },
  icons: { apple: "/app/apple-touch-icon.png" },
};

export const viewport: Viewport = { themeColor: "#F4F1EC", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${playfair.variable} ${manrope.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
