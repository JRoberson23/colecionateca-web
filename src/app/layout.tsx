import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CarrinhoProvider } from "../contexts/CarrinhoContext";
import { AuthProvider } from "../contexts/AuthContext";
import SocialSidebar from "../components/SocialSidebar";

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
    default: "Roberson Store - Solução Completa para seu E-commerce",
    template: "%s | Roberson Store"
  },
  description: "Solução completa para sua loja virtual. Roberson Store é uma plataforma de e-commerce profissional com pagamento, frete e gestão de produtos integrados.",
  keywords: "e-commerce, loja virtual, plataforma de vendas, pagamento online, frete, gestão de produtos, nextjs, react",
  authors: [{ name: "Roberson Junior" }],
  creator: "Roberson Junior",
  publisher: "Roberson Junior",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://roberson-store.vercel.app",
    title: "Roberson Store - Solução Completa para seu E-commerce",
    description: "Solução completa para sua loja virtual. Roberson Store é uma plataforma de e-commerce profissional com pagamento, frete e gestão de produtos integrados.",
    siteName: "Roberson Store",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Roberson Store - Solução em E-commerce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roberson Store - Solução Completa para seu E-commerce",
    description: "Solução completa para sua loja virtual. Roberson Store é uma plataforma de e-commerce profissional com pagamento, frete e gestão de produtos integrados.",
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
            <SocialSidebar />
          </CarrinhoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}