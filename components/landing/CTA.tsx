'use client';

import { H2, LargeText, Button } from './Typography';
import { useCTAAnimation } from '../animations/useGSAPAnimations';
import { useState } from 'react';
import LoginModal from '../auth/LoginModal';

export default function CTA() {
  const ctaRef = useCTAAnimation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <section ref={ctaRef} className="py-20 bg-indigo-900 text-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <H2 className="mb-6 md:text-4xl">Готовы найти своего партнера для стартапа?</H2>
          <LargeText className="mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к сообществу разработчиков, которые строят будущее вместе
          </LargeText>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => setIsLoginModalOpen(true)}
          >
            Зарегистрироваться сейчас
          </Button>
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