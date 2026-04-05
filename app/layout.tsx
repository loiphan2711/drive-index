import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Header } from '@/components/header';
import { ThemeProvider } from '@/context/ThemeContext';
import { ViewModeProvider } from '@/context/ViewModeContext';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Drive Index',
  description:
    'Browse indexed drive content with quick search and layout controls.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <ThemeProvider>
          <ViewModeProvider>
            <Header />
            <div className="flex flex-1 flex-col">{children}</div>
          </ViewModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
