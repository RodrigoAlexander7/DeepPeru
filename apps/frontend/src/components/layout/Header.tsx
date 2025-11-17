'use client';

import { useRouter } from 'next/navigation';

interface HeaderProps {
  variant?: 'default' | 'transparent';
}

export default function Header({ variant = 'default' }: HeaderProps) {
  const router = useRouter();

  const isTransparent = variant === 'transparent';

  return (
    <header
      className={`
        sticky top-0 z-50 transition-colors
        ${
          isTransparent
            ? 'bg-transparent backdrop-blur-md'
            : 'bg-white dark:bg-black shadow-sm'
        }
      `}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => router.push('/')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform" />

            <span
              className={`
                text-xl font-bold transition-colors
                ${isTransparent ? 'text-black' : 'text-black dark:text-white'}
              `}
            >
              DeepPeru
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {['Explorar', 'Destinos', 'Nosotros'].map((item) => (
              <button
                key={item}
                onClick={() =>
                  router.push(
                    item === 'Explorar'
                      ? '/search'
                      : item === 'Destinos'
                        ? '/destinations'
                        : '/about',
                  )
                }
                className={`
                  font-medium transition-colors
                  ${
                    isTransparent
                      ? 'text-black hover:text-gray-800'
                      : 'text-black hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }
                `}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button
              className={`
                p-2 rounded-lg transition-colors
                ${isTransparent ? 'hover:bg-black/10' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
              aria-label="Notifications"
            >
              <svg
                className={`w-6 h-6 ${
                  isTransparent ? 'text-black' : 'text-black dark:text-gray-300'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            {/* Cart */}
            <button
              className={`
                p-2 rounded-lg transition-colors relative
                ${isTransparent ? 'hover:bg-black/10' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
              aria-label="Shopping cart"
            >
              <svg
                className={`w-6 h-6 ${
                  isTransparent ? 'text-black' : 'text-black dark:text-gray-300'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>

              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            {/* User Menu */}
            <button
              onClick={() => router.push('/login')}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center transition-colors
                ${
                  isTransparent
                    ? 'bg-black/10 hover:bg-black/20'
                    : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600'
                }
              `}
              aria-label="User menu"
            >
              <svg
                className={`w-5 h-5 ${
                  isTransparent ? 'text-black' : 'text-black dark:text-gray-300'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            {/* Mobile Menu */}
            <button
              className={`
                md:hidden p-2 rounded-lg transition-colors
                ${isTransparent ? 'hover:bg-black/10' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
              aria-label="Menu"
            >
              <svg
                className={`w-6 h-6 ${
                  isTransparent ? 'text-black' : 'text-black dark:text-gray-300'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
