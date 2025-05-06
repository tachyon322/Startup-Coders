'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '../landing/Typography';
import { useModalAnimation } from '../animations/useGSAPAnimations';
import { gsap } from 'gsap';
import { authClient } from '@/lib/auth-client';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [view, setView] = useState<'main' | 'magic-link'>('main');
  const [isVisible, setIsVisible] = useState(false);
  
  const modalRef = useModalAnimation();
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current && 
        modalContentRef.current && 
        !modalContentRef.current.contains(event.target as Node) &&
        isVisible
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, isVisible]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      
      // Appear animation
      if (modalRef.current) {
        const modal = modalRef.current;
        const modalContent = modal.querySelector('.modal-content');
        
        const tl = gsap.timeline({ defaults: { ease: 'back.out(1.4)' } });
        
        tl.fromTo(
          modal,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
        );
        
        tl.fromTo(
          modalContent,
          { y: -40, scale: 0.9, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.5 },
          "-=0.1"
        );
      }
    } else {
      const closeAnimation = () => {
        if (modalRef.current) {
          const modal = modalRef.current;
          const modalContent = modal.querySelector('.modal-content');
          
          const tl = gsap.timeline({
            defaults: { ease: 'power3.inOut' },
            onComplete: () => setIsVisible(false)
          });
          
          tl.to(modalContent, { y: 50, opacity: 0, duration: 0.3 });
          tl.to(modal, { opacity: 0, duration: 0.2 }, "-=0.1");
        } else {
          setIsVisible(false);
        }
      };

      closeAnimation();
    }
  }, [isOpen]);

  const handleMagicLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // This would have actual implementation in a real app
    setTimeout(() => {
      setIsLoading(false);
      
      if (modalRef.current) {
        const form = modalRef.current.querySelector('form');
        const magicLinkView = modalRef.current.querySelector('.magic-link-view');
        
        // Hide form with animation
        gsap.to(form, {
          opacity: 0,
          y: -20, 
          duration: 0.3,
          onComplete: () => {
            setView('magic-link');
            
            // Show magic link view with animation
            setTimeout(() => {
              gsap.fromTo(
                magicLinkView,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4 }
              );
            }, 50);
          }
        });
      } else {
        setView('magic-link');
      }
    }, 1500);
  };

  if (!isVisible) return null;

  const handleGithubLogin = async() => {
    setIsGithubLoading(true);
    const data = await authClient.signIn.social({
      provider: "github",
    });
    console.log(data);
    setIsGithubLoading(false);
  }

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
    >
      <div 
        ref={modalContentRef}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {view === 'main' ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Войти в систему</h2>
              <p className="text-gray-600">Свяжитесь с разработчиками и постройте свой стартап</p>
            </div>

            <button 
              onClick={handleGithubLogin}
              className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 mb-4 transition-colors"
              disabled={isGithubLoading}
            >
              {isGithubLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="font-medium">Loading...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="font-medium">Войти с помощью GitHub</span>
                </>
              )}
            </button>

            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-600">или</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleMagicLinkSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <Button 
                variant="primary" 
                className="w-full flex items-center justify-center"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                Войти с помощью Magic Link
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-8 magic-link-view">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Проверьте ваш почтовый ящик</h2>
            <p className="text-gray-600 mb-6">
              Мы отправили вам ссылку для входа в систему<br />
              <span className="font-medium">{email}</span>
            </p>
            <p className="text-sm text-gray-500">
              Нажмите на ссылку в письме, чтобы войти в систему.
            </p>
            <button 
              onClick={() => setView('main')} 
              className="mt-8 text-indigo-600 hover:text-indigo-800"
            >
              Вернуться к входу
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 