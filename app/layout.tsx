import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { AppLayoutWrapper } from '@/components/AppLayoutWrapper';
import { Footer } from '@/components/Footer';
import { RouteProgress } from '@/components/RouteProgress';
import { NetworkStatus } from '@/components/NetworkStatus';
import { OnboardingProvider } from '@/components/OnboardingProvider';
import { ChallengeNotificationProvider } from '@/components/ChallengeNotificationProvider';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#080c14',
};

export const metadata: Metadata = {
  title: 'QuizCode | Code Fast. Challenge Friends. Master Quizzes.',
  description:
    'The interactive coding quiz arena for developers. Practice concepts, host live multiplayer rooms, and compete in 1v1 duels.',
  keywords: ['coding quiz', 'developer challenge', 'multiplayer quiz room', 'javascript quiz', 'react quiz', 'python duel'],
  icons: {
    icon: [
      { url: '/graduation-cap.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/graduation-cap.svg',
    apple: '/graduation-cap.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark overflow-x-hidden" suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 font-sans relative bg-grid-pattern selection:bg-[#00d9ff]/30 selection:text-[#00d9ff] overflow-x-hidden w-full max-w-full"
        suppressHydrationWarning
      >
        {/* Startup & Navigation Loaders */}
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>

        {/* Live Network & Offline Monitor */}
        <NetworkStatus />

        {/* Global First-Time & Existing User Onboarding Session */}
        <OnboardingProvider />

        {/* Global 1v1 Friend Challenge Duel Notification Listener */}
        <ChallengeNotificationProvider />

        {/* Rich Ambient Glass Lighting Mesh */}
        <div className="fixed inset-0 pointer-events-none radial-glow -z-10" />
        <div className="fixed -top-40 left-1/4 w-[500px] h-[500px] bg-[#00d9ff]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="fixed top-1/3 -right-40 w-[550px] h-[550px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="fixed bottom-10 -left-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic Desktop Layout Wrapper with Integrated Header */}
        <AppLayoutWrapper>
          <Header />
          <main className="flex-1 flex flex-col w-full relative z-0">{children}</main>
          <Footer />
        </AppLayoutWrapper>
      </body>
    </html>
  );
}
