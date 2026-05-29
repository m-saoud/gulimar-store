import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "جوليمار طرطوس | متجر الأزياء النسائية",
  description: "متجر جوليمار للملابس النسائية الراقية في طرطوس، سوريا. فساتين، بيجامات، لانجري وملابس طلعت بأفضل الأسعار مع توصيل لجميع المحافظات.",
  keywords: "جوليمار, طرطوس, ملابس نسائية, فساتين, بيجامات, لانجري, سوريا",
  openGraph: {
    title: "جوليمار طرطوس",
    description: "متجر الأزياء النسائية الراقية في طرطوس",
    locale: "ar_SY",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-screen flex flex-col" style={{ fontFamily: "'Cairo', sans-serif" }} suppressHydrationWarning>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
