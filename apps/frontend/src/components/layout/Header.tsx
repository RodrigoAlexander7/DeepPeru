'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface HeaderProps {
  variant?: 'default' | 'transparent';
}

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export default function Header({ variant = 'default' }: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isTransparent = variant === 'transparent';

  useEffect(() => {
    // Fetch current user
    fetch('/api/user/me')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setShowUserMenu(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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
            {/* Notifications - solo si está logueado */}
            {user && (
              <button
                className={`
                  p-2 rounded-lg transition-colors
                  ${isTransparent ? 'hover:bg-black/10' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
                aria-label="Notifications"
              >
                <svg
                  className={`w-6 h-6 ${
                    isTransparent
                      ? 'text-black'
                      : 'text-black dark:text-gray-300'
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
            )}

            {/* Cart - solo si está logueado */}
            {user && (
              <button
                className={`
                  p-2 rounded-lg transition-colors relative
                  ${isTransparent ? 'hover:bg-black/10' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
                aria-label="Shopping cart"
              >
                <svg
                  className={`w-6 h-6 ${
                    isTransparent
                      ? 'text-black'
                      : 'text-black dark:text-gray-300'
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
            )}

            {/* User Menu o Login Button */}
            {loading ? (
              // Loading spinner
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ) : user ? (
              // Usuario logueado - mostrar avatar con menú
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition-all
                    ${
                      isTransparent
                        ? 'bg-black/10 hover:bg-black/20'
                        : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600'
                    }
                    ${showUserMenu ? 'ring-2 ring-blue-500' : ''}
                  `}
                  aria-label="User menu"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <svg
                      className={`w-5 h-5 ${
                        isTransparent
                          ? 'text-black'
                          : 'text-black dark:text-gray-300'
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
                  )}
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    {/* Overlay para cerrar el menú al hacer click fuera */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />

                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          router.push('/dashboard');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Mi Dashboard
                      </button>

                      <button
                        onClick={() => {
                          router.push('/profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Mi Perfil
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Usuario NO logueado - mostrar botón de login
              <button
                onClick={() => router.push('/login')}
                className={`px-4 py-2 rounded-full font-medium transition-all
                  ${
                    isTransparent
                      ? 'bg-[var(--primary)] text-white hover:bg-gray-800'
                      : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                  }
                `}
              >
                Iniciar Sesión
              </button>
            )}

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
