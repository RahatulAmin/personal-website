import type { Metadata } from 'next';
import { Header, Footer } from '@/components/Shell';
import { site } from '@/lib/content';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import './globals.css';
export const metadata: Metadata = { title: {default:'Rahatul Ananto — Human–Robot Interaction',template:'%s · Rahatul Ananto'}, description:site.description, ...(site.url ? {metadataBase:new URL(site.url)}:{}), openGraph:{title:'Rahatul Ananto — Human–Robot Interaction',description:site.description,type:'website'} };
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en" data-scroll-behavior="smooth"><body id="top"><div className="site-shell"><Header/><div className="site-content">{children}<Footer/></div></div></body></html>;}
