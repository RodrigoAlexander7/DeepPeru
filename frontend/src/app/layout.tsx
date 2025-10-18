"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono, PT_Sans } from "next/font/google";
import "./globals.css";

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ptSans = PT_Sans({
  weight: '400'
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { fetchUser, isLoading } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  return (
    <html lang="en">
      <body
        className={`${ptSans.className} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
