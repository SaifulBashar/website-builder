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
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.core.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <link
          href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.core.css"
          rel="stylesheet"
        />

        <AntdProvider>{children}</AntdProvider>
      </body>
    </html>
  );
}
