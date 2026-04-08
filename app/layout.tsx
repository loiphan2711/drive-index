import type { Metadata } from 'next';
import { Bangers, JetBrains_Mono } from 'next/font/google';

import { FloatingMenu } from '@/components/FloatingMenu';
import { Header } from '@/components/header';
import { ThemeProvider } from '@/context/ThemeContext';
import { ViewModeProvider } from '@/context/ViewModeContext';

import './globals.css';

const bangers = Bangers({
  variable: '--font-bangers',
  subsets: ['latin'],
  weight: '400',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
      className={`${bangers.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <ThemeProvider>
          <ViewModeProvider>
            <Header />
            <FloatingMenu />
            <div className="flex flex-1 flex-col">{children}</div>
          </ViewModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
