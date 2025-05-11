"use server"

import React from 'react'
import Header from '@/components/landing/Header'
import { getSession } from '@/lib/auth/getSession'
import { redirect } from 'next/navigation'
import { getTags } from '@/data/startup'
import StartupForm from '@/components/StartupForm'


// Background decorative element extracted to its own component
const BackgroundDecoration = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]">
      <div className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-indigo-800 to-indigo-300 opacity-20" 
        style={{ clipPath: "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)" }}></div>
    </div>
  </div>
)

const Page = async () => {
  const session = await getSession()
  
  // Redirect to login if user is not authenticated
  if (!session?.user) {
    redirect('/')
  }
  
  // Fetch tags with cache
  const tags = await getTags()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      <BackgroundDecoration />
      
      <main className="container mx-auto px-4 py-10 max-w-6xl relative">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-indigo-950 sm:text-4xl">
            Создать идею для стартапа
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Поделитесь своей идеей с сообществом и найдите талантливых разработчиков и дизайнеров для сотрудничества
          </p>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg p-6 md:p-8 border border-gray-100">
          <StartupForm tags={tags} />
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Ваш стартап будет виден всем пользователям. Будьте конкретны и четки в своей идее, чтобы привлечь правильных людей.</p>
        </div>
      </main>
    </div>
  )
}

export default Page