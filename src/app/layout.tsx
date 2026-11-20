import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Nuaone Studio — Undangan Pernikahan Digital Eksklusif & Modern',
  description: 'Rayakan kisah cintamu dengan undangan digital yang berkesan, elegan, dan personal. Dilengkapi tautan tamu unik terenkripsi, RSVP, dan amplop digital.',
  keywords: [
    'undangan digital',
    'undangan pernikahan digital',
    'undangan website',
    'undangan online elegan',
    'undangan digital ntt',
    'undangan digital flores',
    'nuaone studio',
  ],
  authors: [{ name: 'Nuaone Studio' }],
  metadataBase: new URL('https://nuaone.my.id'),
  openGraph: {
    title: 'Nuaone Studio — Undangan Pernikahan Digital Eksklusif',
    description: 'Every Story Deserves a Beautiful Beginning. Rayakan momen bahagiamu dengan desain undangan premium dan modern.',
    url: 'https://nuaone.my.id',
    siteName: 'Nuaone Studio',
    locale: 'id_ID',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${playfair.variable} ${jakarta.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#F8F5F0] text-[#252525] flex flex-col font-sans selection:bg-[#D8C3A5] selection:text-[#252525]">
        {children}
      </body>
    </html>
  );
}
