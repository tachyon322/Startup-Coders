import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StartupCoders.ru | Найдите идеального партнера для стартапа",
  description: "Найдите идеального партнера для стартапа. StartupCoders.ru соединяет разработчиков, которые хотят построить что то новое вместе.",
  keywords: ["startup", "developers", "coders", "найти партнера", "тех стартап", "программирование", "партнер по стартапу", "команда стартапа"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
