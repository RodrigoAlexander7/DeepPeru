'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faCartShopping,
  faMagnifyingGlass,
  faBars,
  faXmark,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

interface UserInfo {
  name: string;
  avatar?: string;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const raw =
      typeof window !== 'undefined'
        ? localStorage.getItem('deepperu_user')
        : null;
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const navItems = [
    { label: 'Home', href: '/home' },
    { label: 'Packages', href: '/packages' },
    { label: 'Trips', href: '/travels' },
    { label: 'Lodging', href: '/lodging' },
    { label: 'Activities', href: '/activities' },
    { label: 'Destinations', href: '/destinations' },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-gray-900/70 bg-gray-900/80 border-b border-gray-800">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              aria-label="Toggle menu"
              className="md:hidden text-gray-300 hover:text-white transition-colors"
              onClick={() => setOpen((o) => !o)}
            >
              <FontAwesomeIcon icon={open ? faXmark : faBars} size="lg" />
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform" />
              <span className="text-xl font-bold tracking-tight text-white">
                DeepPeru
              </span>
            </Link>
            <ul className="hidden md:flex items-center gap-2 lg:gap-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 hidden lg:flex">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="w-full relative max-w-xl"
            >
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations, packages..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-800/70 border border-gray-700 focus:border-blue-500 outline-none text-sm text-gray-200 placeholder-gray-500 transition-colors"
              />
            </form>
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label="Notifications"
              className="p-2 rounded-lg bg-gray-800/70 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faBell} />
            </button>
            <button
              aria-label="Cart"
              className="p-2 rounded-lg bg-gray-800/70 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faCartShopping} />
            </button>
            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-gray-800/70 border border-gray-700 hover:border-blue-500 transition-colors"
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                )}
                <span className="hidden sm:inline text-sm font-medium text-gray-200">
                  {user.name.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:from-blue-500 hover:to-purple-500 transition-all"
              >
                Register
              </Link>
            )}
          </div>
        </div>
        {open && (
          <div className="md:hidden pb-4 animate-fade-in">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    onClick={() => setOpen(false)}
                    href={item.href}
                    className="block px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-3 relative"
            >
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations, packages..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-800/70 border border-gray-700 focus:border-blue-500 outline-none text-sm text-gray-200 placeholder-gray-500 transition-colors"
              />
            </form>
          </div>
        )}
      </nav>
    </header>
  );
}
