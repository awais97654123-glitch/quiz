import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RouteProgress } from '@/components/RouteProgress';
import { NetworkStatus } from '@/components/NetworkStatus';
import { OnboardingProvider } from '@/components/OnboardingProvider';
import { ChallengeNotificationProvider } from '@/components/ChallengeNotificationProvider';
import { AppSplashLoader } from '@/components/AppSplashLoader';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#eef2f9',
};

export const metadata: Metadata = {
  title: 'CodeQuiz | Test Your Knowledge. Challenge Your Friends.',
  description:
    'The interactive quiz platform for developers. Practice coding concepts, create multiplayer quiz rooms, and challenge your friends in real-time.',
  keywords: ['developer quiz', 'coding quiz', 'multiplayer quiz', 'javascript quiz', 'react test', 'programming challenge'],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased overflow-x-hidden" suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col bg-[#eef2f9] text-slate-900 font-sans relative bg-grid-pattern selection:bg-cyan-500/25 selection:text-cyan-900 overflow-x-hidden w-full max-w-full"
        suppressHydrationWarning
      >
        {/* Animated Boarding Splash (first visit) */}
        <AppSplashLoader />

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

        {/* Soft Ambient Lighting Mesh */}
        <div className="fixed inset-0 pointer-events-none radial-glow -z-10" />
        <div className="fixed -top-40 left-1/4 w-[500px] h-[500px] bg-cyan-300/25 rounded-full blur-[130px] pointer-events-none -z-10" />
        <div className="fixed top-1/3 -right-40 w-[550px] h-[550px] bg-indigo-300/20 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="fixed bottom-10 -left-40 w-[500px] h-[500px] bg-violet-300/20 rounded-full blur-[130px] pointer-events-none -z-10" />
        <div className="fixed -bottom-20 right-1/4 w-[450px] h-[450px] bg-sky-300/20 rounded-full blur-[130px] pointer-events-none -z-10" />

        <Navbar />
        <main className="flex-1 flex flex-col w-full relative z-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
