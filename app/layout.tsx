import { type Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ProfileProvider } from '../context/ProfileContext';
import './globals.css'
import { Header } from '@/components/header'


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
          <Header />
          {children}
        </body>
      </html>
    </ProfileProvider>
  )
}