import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import HowItWorks from '../components/landing/HowItWorks';
import Features from '../components/landing/Features';
import CTA from '../components/landing/CTA';
import { getSession } from '@/lib/auth/getSession';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StartupCoders.ru - Найдите идеального партнера для стартапа',
  description: 'Найдите идеального партнера для стартапа. StartupCoders.ru соединяет разработчиков, дизайнеров и предпринимателей, которые хотят построить что-то новое вместе. Создайте команду мечты для вашего проекта.',
  keywords: [
    'найти партнера для стартапа', 'стартап команда', 'разработчики для стартапа',
    'IT партнер стартап', 'соучредитель стартапа', 'техническое партнерство',
    'поиск программиста для стартапа', 'команда разработчиков'
  ],
  openGraph: {
    title: 'StartupCoders.ru - Найдите идеального партнера для стартапа',
    description: 'Соединяем разработчиков, дизайнеров и предпринимателей для создания успешных стартапов',
    url: 'https://startupcoders.ru',
    type: 'website',
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
    description: 'Соединяем разработчиков, дизайнеров и предпринимателей для создания успешных стартапов',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://startupcoders.ru',
  },
};

export default async function Home() {
  const session = await getSession();

  return (
    <>
      {/* Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "StartupCoders.ru",
            "url": "https://startupcoders.ru",
            "logo": "https://startupcoders.ru/logo.png",
            "description": "Платформа для поиска партнеров по стартапу, соединяющая разработчиков, дизайнеров и предпринимателей",
            "foundingDate": "2024",
            "sameAs": [
              "https://t.me/startupcoders_ru",
              "https://github.com/startupcoders-ru"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "availableLanguage": "Russian"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Russia"
            },
            "serviceType": "Startup Team Building Platform"
          })
        }}
      />
      
      <main className="min-h-screen flex flex-col">
        <Header session={session} />
        <HeroSection />
        <HowItWorks />
        <Features />
        <CTA />
      </main>
    </>
  );
}
