'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useHeroAnimation() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const hero = heroRef.current;
    const heading = hero.querySelector('h1');
    const desc = hero.querySelector('p');
    const buttons = hero.querySelectorAll('button');
    const codeBlock = hero.querySelector('.code-block');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      heading,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    );

    tl.fromTo(
      desc,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      "-=0.4"
    );

    tl.fromTo(
      buttons,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
      "-=0.4"
    );

    tl.fromTo(
      codeBlock,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8 },
      "-=0.6"
    );

    return () => {
      tl.kill();
    };
  }, []);

  return heroRef;
}

export function useHowItWorksAnimation() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const heading = section.querySelector('h2');
    const steps = section.querySelectorAll('.step');

    gsap.fromTo(
      heading,
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.7,
        scrollTrigger: {
          trigger: heading,
          start: 'top 80%',
        }
      }
    );

    steps.forEach((step, index) => {
      gsap.fromTo(
        step,
        { y: 70, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.7,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return sectionRef;
}

export function useFeaturesAnimation() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const heading = section.querySelector('h2');
    const cards = section.querySelectorAll('.feature-card');

    gsap.fromTo(
      heading,
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.7,
        scrollTrigger: {
          trigger: heading,
          start: 'top 80%',
        }
      }
    );

    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return sectionRef;
}

export function useCTAAnimation() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const elements = section.querySelectorAll('h2, p, button');

    gsap.fromTo(
      elements,
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.7,
        stagger: 0.2,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return sectionRef;
}

export function useModalAnimation() {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modalRef.current) return;

    const modal = modalRef.current;
    const modalContent = modal.querySelector('.modal-content');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      modal,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    );

    tl.fromTo(
      modalContent,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4 },
      "-=0.1"
    );

    return () => {
      tl.kill();
    };
  }, []);

  return modalRef;
} 