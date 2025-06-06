"use client";

import { useState } from "react";
import Link from "next/link";
import LoginModal from "../auth/LoginModal";
import type { Session } from "../../types/base";
import UserDropdown from "../ui/UserDropdown";

interface HeaderProps {
  session: Session | null;
}

export default function Header({ session }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-indigo-950 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link
                href={session ? "/find" : "/"}
                className="text-2xl font-bold flex items-baseline logo"
              >
                <span className="text-indigo-300">Startup</span>
                <span>Coders</span>
                <span className="text-indigo-300 text-sm ml-1">.ru</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-10">
              <Link
                href="/find"
                className="hover:text-indigo-300 transition-colors"
              >
                Найти
              </Link>
              <Link
                href="/donate"
                className="hover:text-indigo-300 transition-colors"
              >
                Помочь сайту
              </Link>
              <Link
                href="/about"
                className="hover:text-indigo-300 transition-colors"
              >
                О нас
              </Link>
            </nav>

            {session ? (
              <div className="items-center hidden md:flex">
                <UserDropdown session={session} />
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                {" "}
                <button
                  className="text-indigo-300 hover:text-white py-2 w-full text-left transition-colors"
                  onClick={openLoginModal}
                >
                  Войти
                </button>
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-all"
                  onClick={openLoginModal}
                >
                  Регистрация
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden flex gap-3">
              {session ? (
                <div className="flex items-center">
                  <UserDropdown session={session} />
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  {" "}
                  <button
                    className="text-indigo-300 hover:text-white py-2 text-left transition-colors"
                    onClick={openLoginModal}
                  >
                    Войти
                  </button>
                  <button
                    className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-all"
                    onClick={openLoginModal}
                  >
                    Регистрация
                  </button>
                </div>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white"
              >
                {!isMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-indigo-800">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/find"
                  className="hover:text-indigo-300 transition-colors"
                >
                  Найти
                </Link>
                <Link
                  href="/donate"
                  className="hover:text-indigo-300 transition-colors"
                >
                  Помочь сайту
                </Link>
                <Link
                  href="/about"
                  className="hover:text-indigo-300 transition-colors"
                >
                  О нас
                </Link>
              </nav>

              {/* Moved user/auth elements here */}
              <div className="mt-6 flex flex-col space-y-2">
                {session ? (
                  <div className="flex items-center"></div>
                ) : (
                  <div className="">
                    {" "}
                    <button
                      className="text-indigo-300 hover:text-white py-2 w-full text-left transition-colors"
                      onClick={openLoginModal}
                    >
                      Войти
                    </button>
                    <button
                      className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-all"
                      onClick={openLoginModal}
                    >
                      Регистрация
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
