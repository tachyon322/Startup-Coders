'use client';

import { H2, H3, Text } from './Typography';
import { useHowItWorksAnimation } from '../animations/useGSAPAnimations';

export default function HowItWorks() {
  const sectionRef = useHowItWorksAnimation();

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <H2 className="text-center mb-16">Как работает StartupCoders.ru</H2>
        
        <div className="grid md:grid-cols-3 gap-10">
          <Step 
            number={1} 
            title="Создайте свой профиль" 
            description="Покажите свои навыки, опыт и идеи для стартапа, чтобы привлечь похожих разработчиков."
          />
          
          <Step 
            number={2} 
            title="Свяжитесь с разработчиками" 
            description="Просмотрите профили и свяжитесь с разработчиками, которые дополнят ваши навыки."
          />
          
          <Step 
            number={3} 
            title="Постройте свой стартап" 
            description="Сформируйте свою команду, сотрудничайте над идеями и начните строить ваш продукт вместе."
          />
        </div>
      </div>
    </section>
  );
}

interface StepProps {
  number: number;
  title: string;
  description: string;
}

function Step({ number, title, description }: StepProps) {
  return (
    <div className="flex flex-col items-center text-center step">
      <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-indigo-600 text-2xl font-bold">{number}</span>
      </div>
      <H3 className="mb-4">{title}</H3>
      <Text className="text-gray-600">{description}</Text>
    </div>
  );
} 