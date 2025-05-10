import React from "react";
import Header from "@/components/landing/Header";
import { getSession } from "@/lib/auth/getSession";
import DonateForm from "@/components/DonateForm";

export const generateStaticParams = async () => {
  return [];
};

export const metadata = {
  title: "Поддержать проект | StartupCoders.ru",
  description: "Поддержите развитие платформы StartupCoders.ru вашими пожертвованиями",
};

const DonatePage = async () => {
  const session = await getSession();
  return (
    <div className="min-h-screen flex flex-col">
      <Header session={session} />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-900 mb-4">
            Поддержите наш проект
          </h1>
          
          <p className="text-gray-700 text-center max-w-2xl mx-auto mb-12">
            Ваши пожертвования помогают нам развивать платформу StartupCoders.ru, 
            улучшать функциональность и создавать лучший сервис для соединения 
            талантливых людей в стартап-команды.
          </p>
          
          <DonateForm />
        </div>
      </main>
    </div>
  );
};

export default DonatePage;
