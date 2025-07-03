import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Kıvılcım - Otizm Dostu Öğrenme Platformu",
  description: "Otizmli çocuklar için özel olarak tasarlanmış eğitim platformu. Modüler gelişim alanları ile sakin ve öngörülebilir öğrenme deneyimi.",
  keywords: ["otizm", "öğrenme", "çocuk", "eğitim", "gelişim", "kıvılcım"],
  authors: [{ name: "Kıvılcım Geliştirme Ekibi" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={nunito.variable}>
      <body className={`${nunito.className} antialiased bg-calm-blue min-h-screen font-sans text-text-color`}>
        {children}
      </body>
    </html>
  );
}
