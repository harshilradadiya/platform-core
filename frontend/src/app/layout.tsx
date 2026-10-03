import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://flowfetch.app'),
  title: {
    default: 'FlowFetch — Sub-Second Media Resolution Utility',
    template: '%s | FlowFetch',
  },
  description:
    'Paste a YouTube or Pinterest link and get every download format in under 2 seconds. Zero uploads, zero storage, DMCA compliant.',
  keywords: [
    'flowfetch',
    'youtube downloader',
    'pinterest video downloader',
    'save pin',
    'zero buffer downloader',
    'mp3 converter',
  ],
  authors: [{ name: 'FlowFetch' }],
  openGraph: {
    title: 'FlowFetch — Sub-Second Media Resolution Utility',
    description:
      'Paste a YouTube or Pinterest link and get every download format in under 2 seconds. Zero uploads, zero storage, DMCA compliant.',
    type: 'website',
    url: 'https://flowfetch.app',
    siteName: 'FlowFetch',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  localStorage.setItem('theme', 'dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.pinimg.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://i.pinimg.com" />
      </head>
      <body className="min-h-screen flex flex-col justify-between bg-[#09090B] text-[#FAFAFA] font-sans selection:bg-red-500/20 selection:text-white">
        <Header />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
