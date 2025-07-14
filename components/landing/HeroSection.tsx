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
      <section className="bg-gradient-to-b from-indigo-950 to-indigo-900 text-white py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
            <div className="w-full md:w-1/2 text-center md:text-left">
              <H1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                Найдите идеального <HighlightText>партнера для стартапа</HighlightText>
              </H1>
              <LargeText className="mb-6 sm:mb-8 text-indigo-100 text-base sm:text-lg md:text-xl">
                Свяжитесь с талантливыми разработчиками, готовыми построить что то новое
              </LargeText>
              <div className="flex gap-3 sm:gap-4 flex-wrap justify-center md:justify-start">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  Присоединиться сейчас
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2 mt-8 md:mt-0">
              <div className="relative code-block max-w-md mx-auto md:max-w-none">
                <div className="bg-indigo-800 rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl">
                  <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="overflow-x-auto">
                    <pre className="font-mono text-indigo-200 text-xs sm:text-sm whitespace-pre">
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