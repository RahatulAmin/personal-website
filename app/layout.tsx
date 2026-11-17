import type { Metadata } from 'next';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Header, Footer } from '@/components/Shell';
import { site } from '@/lib/content';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import './globals.css';

const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export const metadata: Metadata = {
  title: {
    default: 'Rahatul Ananto — Human–Robot Interaction',
    template: '%s · Rahatul Ananto',
  },
  description: site.description,
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
  openGraph: {
    title: 'Rahatul Ananto — Human–Robot Interaction',
    description: site.description,
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body id="top">
        <div className="site-shell">
          <Header />
          <div className="site-content">
            {children}
            <Footer />
          </div>
        </div>
      </body>
      <Script
        data-goatcounter="https://rahatul.goatcounter.com/count"
        src="https://gc.zgo.at/count.js"
      />
      {googleAnalyticsId ? <GoogleAnalytics gaId={googleAnalyticsId} /> : null}
    </html>
  );
}
