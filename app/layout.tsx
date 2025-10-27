import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AntdProvider } from '@/components/providers/AntdProvider';
import '@ant-design/v5-patch-for-react-19';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Website Builder',
  description: 'Build websites with drag and drop',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdProvider>{children}</AntdProvider>
      </body>
    </html>
  );
}
