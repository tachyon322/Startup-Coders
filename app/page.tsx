"use server"

import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import HowItWorks from '../components/landing/HowItWorks';
import Features from '../components/landing/Features';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';
import { getSession } from '@/lib/auth/getSession';

export default async function Home() {
  const session = await getSession();

  return (
    <main className="min-h-screen flex flex-col">
      {JSON.stringify(session)}
      <Header session={session} />
      <HeroSection />
      <HowItWorks />
      <Features />
      <CTA />
    </main>
  );
}
