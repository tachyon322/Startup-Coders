'use client';

import { H2, H3, Text } from './Typography';
import { useFeaturesAnimation } from '../animations/useGSAPAnimations';

export default function Features() {
  const sectionRef = useFeaturesAnimation();

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <H2 className="text-center mb-16">Почему стоит попробовать проект</H2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon="🧩" 
            title="Подбор по навыкам" 
            description="Найдите разработчиков, которые имеют дополнительные навыки."
          />
          
          <FeatureCard 
            icon="🌐" 
            title="Глобальная сеть" 
            description="Свяжитесь с талантливыми разработчиками со всей страны, расширяя ваш потенциальный пул."
          />
          
          <FeatureCard 
            icon="🔒" 
            title="Простая коммуникация" 
            description="Предоставляем возможность связаться с разработчиками в различных социальных сетях"
          />

        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md feature-card">
      <div className="text-indigo-600 mb-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
          <span className="font-bold">{icon}</span>
        </div>
      </div>
      <H3 className="mb-3">{title}</H3>
      <Text className="text-gray-600">{description}</Text>
    </div>
  );
} 