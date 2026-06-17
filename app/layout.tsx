import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const description =
  'GitHub notifications for Discord. Stay connected to every commit, pull request, and deployment — without leaving your server.';

export const metadata: Metadata = {
  metadataBase: new URL('https://octoflow.ca'),
  title: {
    template: '%s | Octoflow',
    default: 'Octoflow',
  },
  description,
  openGraph: {
    title: 'Octoflow',
    description,
    siteName: 'Octoflow',
    url: 'https://octoflow.ca',
    type: 'website',
    images: [{ url: '/banner.png', width: 1200, height: 630, alt: 'Octoflow' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Octoflow',
    description,
    creator: '@HeyOctoflow',
    images: ['/banner.png'],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen font-sans">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
