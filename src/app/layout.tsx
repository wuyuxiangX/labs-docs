import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Second Me Documentation',
  description: 'Second Me (MeBot) Developer Documentation',
  icons: {
    icon: { url: '/secondme_logo.svg', type: 'image/svg+xml' },
  },
  manifest: '/manifest.json',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
