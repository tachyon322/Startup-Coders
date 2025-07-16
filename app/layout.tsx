import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

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
    default: "StartupCoders.ru - Найдите идеального партнера для стартапа",
    template: "%s | StartupCoders.ru"
  },
  description: "Найдите идеального партнера для стартапа. StartupCoders.ru соединяет разработчиков, дизайнеров и предпринимателей, которые хотят построить что-то новое вместе. Создайте команду мечты для вашего проекта.",
  keywords: [
    "startup", "стартап", "developers", "разработчики", "coders", "программисты",
    "найти партнера", "тех стартап", "программирование", "партнер по стартапу", 
    "команда стартапа", "соучредитель", "IT партнер", "техническое партнерство",
    "стартап команда", "поиск разработчика", "найти программиста"
  ],
  authors: [{ name: "StartupCoders.ru" }],
  creator: "StartupCoders.ru",
  publisher: "StartupCoders.ru",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://startupcoders.ru'),
  alternates: {
    canonical: '/',
    languages: {
      'ru-RU': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://startupcoders.ru',
    title: 'StartupCoders.ru - Найдите идеального партнера для стартапа',
    description: 'Найдите идеального партнера для стартапа. StartupCoders.ru соединяет разработчиков, дизайнеров и предпринимателей, которые хотят построить что-то новое вместе.',
    siteName: 'StartupCoders.ru',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'StartupCoders.ru - Платформа для поиска партнеров по стартапу',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StartupCoders.ru - Найдите идеального партнера для стартапа',
    description: 'Найдите идеального партнера для стартапа. Соединяем разработчиков, дизайнеров и предпринимателей.',
    images: ['/og-image.jpg'],
    creator: '@startupcoders_ru',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/apple-touch-icon-57x57.png', sizes: '57x57' },
      { url: '/apple-touch-icon-60x60.png', sizes: '60x60' },
      { url: '/apple-touch-icon-72x72.png', sizes: '72x72' },
      { url: '/apple-touch-icon-76x76.png', sizes: '76x76' },
      { url: '/apple-touch-icon-114x114.png', sizes: '114x114' },
      { url: '/apple-touch-icon-120x120.png', sizes: '120x120' },
      { url: '/apple-touch-icon-144x144.png', sizes: '144x144' },
      { url: '/apple-touch-icon-152x152.png', sizes: '152x152' },
      { url: '/apple-touch-icon-180x180.png', sizes: '180x180' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://startupcoders.ru" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        {children}
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "StartupCoders.ru",
              "url": "https://startupcoders.ru",
              "description": "Платформа для поиска партнеров по стартапу",
              "inLanguage": "ru-RU",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://startupcoders.ru/find?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
