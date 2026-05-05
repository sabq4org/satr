import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'سطر — الخبر زبدة',
  description: 'صحيفة إلكترونية ذكية تقدم كل خبر في 3 أسطر فقط. لا حشو، لا قشور.',
  keywords: ['أخبار', 'سطر', 'صحيفة', 'السعودية', 'موجز'],
  openGraph: {
    title: 'سطر — الخبر زبدة',
    description: 'كل خبر في 3 أسطر فقط.',
    type: 'website',
    locale: 'ar_SA',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
