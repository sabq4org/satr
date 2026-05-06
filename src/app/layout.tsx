import type { Metadata, Viewport } from 'next';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3007';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'سطر — كل خبر في ٣ سطور',
    template: '%s — سطر',
  },
  description: 'صحيفة إلكترونية ذكية تقدم كل خبر في ٣ سطور فقط: الحدث، السياق، المعنى. لا حشو، لا قشور.',
  keywords: ['أخبار', 'سطر', 'صحيفة', 'السعودية', 'موجز', 'أخبار مختصرة', 'ذكاء اصطناعي', 'إعلام'],
  authors: [{ name: 'سطر' }],
  creator: 'سطر',
  publisher: 'سطر',
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    title: 'سطر — كل خبر في ٣ سطور',
    description: 'كل خبر في ٣ سطور فقط.',
    url: SITE_URL,
    siteName: 'سطر',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سطر — كل خبر في ٣ سطور',
    description: 'كل خبر في ٣ سطور فقط.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#1a3a5e',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
