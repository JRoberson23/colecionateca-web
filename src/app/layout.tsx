import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CarrinhoProvider } from "../contexts/CarrinhoContext";
import { AuthProvider } from "../contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Colecionateca - Loja de Consoles e Jogos Antigos",
    template: "%s | Colecionateca"
  },
  description: "A Colecionateca é a sua loja de consoles e jogos antigos. Encontre clássicos do SNES, Nintendo 64, Mega Drive e muito mais!",
  keywords: "consoles antigos, jogos retro, SNES, Nintendo 64, Mega Drive, colecionador, jogos clássicos",
  authors: [{ name: "Colecionateca" }],
  creator: "Colecionateca",
  publisher: "Colecionateca",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://colecionateca.vercel.app",
    title: "Colecionateca - Loja de Consoles e Jogos Antigos",
    description: "A Colecionateca é a sua loja de consoles e jogos antigos. Encontre clássicos do SNES, Nintendo 64, Mega Drive e muito mais!",
    siteName: "Colecionateca",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Colecionateca - Loja de Consoles Antigos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Colecionateca - Loja de Consoles e Jogos Antigos",
    description: "A Colecionateca é a sua loja de consoles e jogos antigos. Encontre clássicos do SNES, Nintendo 64, Mega Drive e muito mais!",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <CarrinhoProvider>
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </CarrinhoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}