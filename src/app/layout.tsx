'use client';
import './globals.css';
import '../assets/css/argon-dashboard-tailwind.css';
import '../assets/css/nucleo-svg.css';
import '../assets/css/nucleo-icons.css';
import '../assets/css/perfect-scrollbar.css';
import '../assets/css/tooltips.css';
import { Open_Sans } from 'next/font/google';
import Script from 'next/script';
import { Providers } from '@/components/providers';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '300', '600', '700'],
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <Script src='/assets/js/argon-dashboard-tailwind.js' async></Script>
      <Script src='https://kit.fontawesome.com/42d5adcbca.js'></Script>
      <body className={openSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
