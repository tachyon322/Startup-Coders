import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-12 bg-gray-900 text-gray-400">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-8 md:mb-0">
            <h3 className="text-white text-xl font-bold mb-4">StartupCoders.ru</h3>
            <p className="max-w-xs">Связывает талантливых разработчиков для построения следующего поколения стартапов.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Платформа</h4>
              <ul className="space-y-2">
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">Как это работает</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Просмотреть разработчиков</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Страницы успеха</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Ресурсы</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">Блог</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Руководства</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Компания</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">О нас</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Контакты</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Политика конфиденциальности</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center md:text-left md:flex md:justify-between md:items-center">
          <p>&copy; {new Date().getFullYear()} StartupCoders.ru. Все права защищены.</p>
          <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-6">
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 