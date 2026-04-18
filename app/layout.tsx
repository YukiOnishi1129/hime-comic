import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { MobileNav } from "@/components/mobile-nav";
import "./globals.css";

const GA_MEASUREMENT_ID = "";

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
    default: "ひめコミ | TL・乙女向け同人コミックまとめ",
    template: "%s | ひめコミ",
  },
  description:
    "TL・乙女向け同人コミックの最新ランキング、セール情報、おすすめ作品を毎日更新。DLsite・FANZAの人気作品をチェック！",
  keywords: ["TL", "乙女", "同人", "コミック", "DLsite", "FANZA", "セール", "ランキング"],
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon-256.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "256x256",
        url: "/favicon-256.png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "ひめコミ",
    images: [
      { url: "https://hime-comic.com/ogp/recommendation_ogp.png", width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <MobileNav />
        {/* モバイルナビの高さ分の余白 */}
        <div className="h-14 md:hidden" />
      </body>
    </html>
  );
}
