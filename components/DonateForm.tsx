import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import QRCode from "@/public/images/qr.jpg"
import Image from 'next/image';

const DonateForm = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Поддержите проект</CardTitle>
        <CardDescription>Спасибо за вашу поддержку! Все средства будут направлены на развитие проекта.</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* QR Code Section */}
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 mb-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center h-full">
              {/* Placeholder for QR code - replace with your actual QR code */}
              <div className="text-gray-500 text-center">
                <p className="text-sm">Добавьте ваш QR-код здесь</p>
                <p className="text-xs mt-2">Рекомендуемый размер: 400×400 пикселей</p>
              </div>
              
              <Image
                src={QRCode}
                alt="QR код для перевода"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center">Отсканируйте QR-код для быстрого перевода</p>
        </div>
        
        {/* Payment Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-center">Реквизиты для перевода</h3>
          
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Банковская карта</p>
              <p className="text-base">2200 7008 8571 9939</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700">Получатель</p>
              <p className="text-base">Черемных Денис</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700">Банк</p>
              <p className="text-base">Т-банк</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Электронный кошелек (Юмани)</p>
              <p className="text-base">4100116376229545</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Криптовалюта (BEP-20)</p>
              <p className="text-base break-all">0x4f5e2e578b877ba839b71617866e33e282305645</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col items-center">
        <p className="text-sm text-gray-500 text-center">По всем вопросам обращайтесь на почту: den.voprosik@gmail.com</p>
      </CardFooter>
    </Card>
  );
};

export default DonateForm; 