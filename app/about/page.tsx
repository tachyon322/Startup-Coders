import React from "react";
import Header from "@/components/landing/Header";
import { getSession } from "@/lib/auth/getSession";
import AboutContent from "@/components/AboutContent";

export const generateStaticParams = async () => {
  return [];
};

export const metadata = {
  title: "О нас | StartupCoders.ru",
  description: "Узнайте больше о проекте StartupCoders.ru — платформе для поиска партнеров по стартапу",
};

const AboutPage = async () => {
  const session = await getSession();
  return (
    <div className="min-h-screen flex flex-col">
      <Header session={session} />
      
      <main className="flex-grow bg-gray-50">
        <AboutContent />
      </main>
    </div>
  );
};

export default AboutPage;
