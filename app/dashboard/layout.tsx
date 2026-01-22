// app/layout.tsx
import type { Metadata } from 'next'
import StoreProvider from '@/app/StoreProvider'
import ThemeProvider from '@/components/providers/ThemeProvider'
import '@/app/globals.css'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Modern Dashboard',
  description: 'Modern dashboard with Next.js 16 & Tailwind CSS v4',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <StoreProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-background">
              <Sidebar />
              <div className="lg:pl-72">
                <Header />
                <main className="py-10">
                  <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
                <Footer />
              </div>
            </div>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
