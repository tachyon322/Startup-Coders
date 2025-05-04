'use client';

import { H1, LargeText, HighlightText, Button } from './Typography';
import { useHeroAnimation } from '../animations/useGSAPAnimations';
import { useState } from 'react';
import LoginModal from '../auth/LoginModal';

export default function HeroSection() {
  const heroRef = useHeroAnimation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <section ref={heroRef} className="bg-gradient-to-b from-indigo-950 to-indigo-900 text-white py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2">
              <H1 className="mb-6">
                Найдите идеального <HighlightText>партнера для стартапа</HighlightText>
              </H1>
              <LargeText className="mb-8 text-indigo-100">
                Свяжитесь с талантливыми разработчиками, готовыми построить что то новое
              </LargeText>
              <div className="flex gap-4 flex-wrap">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  Присоединиться сейчас
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative code-block">
                <div className="bg-indigo-800 rounded-xl p-8 shadow-2xl">
                  <div className="flex gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <pre className="font-mono text-indigo-200 text-sm">
                    <code>{`// Finding the perfect partner
const startupCoders = {
  connect: () => developers.filter(dev => 
    dev.skills.match(yourNeeds) && 
    dev.goals.align(yourVision)
  ),
  build: (team) => team.createAwesomeProduct(),
  launch: (product) => market.disrupt(product)
};

// Ready to code together?
startupCoders.connect();`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
} 