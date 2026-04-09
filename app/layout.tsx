import type { Metadata } from 'next';
import { Press_Start_2P, Space_Mono } from 'next/font/google';

import { PacmanBackground } from '@/components/background';
import { FloatingMenu } from '@/components/FloatingMenu';
import { Header } from '@/components/header';
import { ThemeProvider } from '@/context/ThemeContext';
import { ViewModeProvider } from '@/context/ViewModeContext';
import { SWRProvider } from '@/lib/swr/provider';

import './globals.css';

const pressStart2P = Press_Start_2P({
  variable: '--font-press-start',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
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
      className={`${pressStart2P.variable} ${spaceMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <PacmanBackground />
        <SWRProvider>
          <ThemeProvider>
            <ViewModeProvider>
              <div className="relative z-10 flex min-h-full flex-col">
                <Header />
                <FloatingMenu />
                <div className="flex flex-1 flex-col">{children}</div>
              </div>
            </ViewModeProvider>
          </ThemeProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
