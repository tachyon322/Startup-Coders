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
            маркетологов и других специалистов, желающих объединить усилия для создания инновационных 
            стартапов. Мы верим, что лучшие идеи рождаются в сотрудничестве, и наша миссия — 
            помочь амбициозным профессионалам найти единомышленников для воплощения своих проектов в жизнь.
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
            <li>
              <strong>Нетворкинг</strong> — расширяйте свою профессиональную сеть в сообществе единомышленников
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Наши ценности</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="font-semibold text-xl text-indigo-700 mb-2">Сотрудничество</h3>
              <p className="text-gray-600">
                Мы верим в силу коллективного разума и взаимодополняющих навыков для решения сложных задач.
              </p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="font-semibold text-xl text-indigo-700 mb-2">Инновации</h3>
              <p className="text-gray-600">
                Мы поддерживаем смелые идеи и нестандартные подходы, способные изменить мир к лучшему.
              </p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="font-semibold text-xl text-indigo-700 mb-2">Доверие</h3>
              <p className="text-gray-600">
                Мы создаем безопасную среду, где участники могут делиться идеями и строить долгосрочные отношения.
              </p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="font-semibold text-xl text-indigo-700 mb-2">Развитие</h3>
              <p className="text-gray-600">
                Мы стремимся к постоянному совершенствованию платформы и росту сообщества.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Присоединяйтесь к нам</h2>
          <p className="text-gray-700 mb-6">
            StartupCoders.ru — это больше, чем просто платформа, это активно растущее сообщество 
            профессионалов, объединенных общей целью — создавать инновационные проекты и менять мир к лучшему. 
            Независимо от вашего опыта или специализации, здесь вы можете найти свое место 
            и людей, готовых поддержать ваши амбиции.
          </p>
          <div className="text-center">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition-all">
              Зарегистрироваться
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutContent; 