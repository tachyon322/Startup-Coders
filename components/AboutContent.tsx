import React from 'react';

const AboutContent = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-indigo-900 mb-8 text-center">О проекте StartupCoders.ru</h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-10">
          <p className="text-gray-700 mb-4">
            Сайт создан на NextJs (планирую переписать на solid-start) <br />
            Является некоммерческим. <br />
            <span className='text-red-400'>САЙТ НЕ НЕСЕТ ОТВЕТСТВЕННОСТИ ЗА ИНФОРМАЦИЮ КОТОРУЮ ПУБЛИКУЮТ ПОЛЬЗОВАТЕЛИ НА САЙТЕ!</span>
          </p>
            Мой тикток: <a href="https://www.tiktok.com/@dens30451?_t=ZN-8xCf79Njmg2&_r=1" className="text-blue-500 hover:underline">@dens30451</a> <br />
            Мой телеграм: <a href="https://t.me/QTSJSMA" className="text-blue-500 hover:underline">@QTSJSMA</a> <br />
        </section>
      </div>
    </div>
  );
};

export default AboutContent; 