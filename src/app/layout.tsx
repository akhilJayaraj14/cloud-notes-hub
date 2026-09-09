import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cloud Study Notes & Knowledge Hub',
  description: 'A modern, searchable knowledge base for cloud certifications, architecture patterns, DevOps, and study notes.',
  openGraph: {
    title: 'Cloud Study Notes & Knowledge Hub',
    description: 'A modern, searchable knowledge base for cloud certifications, architecture patterns, DevOps, and study notes.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-[#090d16] text-slate-100 antialiased min-h-screen flex flex-col justify-between selection:bg-sky-500/30 selection:text-sky-200`}>
        <div>
          <Navbar />
          <main>{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
