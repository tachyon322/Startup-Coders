import React from 'react';

const AboutContent = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-indigo-900 mb-8 text-center">О проекте StartupCoders.ru</h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Наша миссия</h2>
          <p className="text-gray-700 mb-4">
            StartupCoders.ru — это платформа, которая соединяет талантливых разработчиков, дизайнеров, 
            маркетологов и других специалистов, желающих объединить усилия для создания
            стартапов.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Что мы предлагаем</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>
              <strong>Поиск партнеров</strong> — находите специалистов с дополняющими навыками для вашего проекта
            </li>
            <li>
              <strong>Представление идей</strong> — делитесь своими концепциями и привлекайте заинтересованных участников
            </li>
            <li>
              <strong>Формирование команд</strong> — создавайте сбалансированные команды для реализации стартапов
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutContent; 