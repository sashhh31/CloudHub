import { type Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ProfileProvider } from '../context/ProfileContext';
import './globals.css'
import { Header } from '@/components/header'
import Script from 'next/script';

export const metadata: Metadata = {
  title: "KnowAI - AI Career Coach",
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProfileProvider>
      <html lang="en">
        <body className={`${inter.variable} antialiased`}>
          {/* Google Tag Manager Script */}
          <Script 
            async
            src="https://www.googletagmanager.com/gtag/js?id=AW-16956742446"
            strategy="afterInteractive"
          />
          <Script 
            id="google-ads-config"
            strategy="afterInteractive"
          >
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-16956742446');
              });
            `}
          </Script>
          
          <Header />
          {children}
        </body>
      </html>
    </ProfileProvider>
  )
}
