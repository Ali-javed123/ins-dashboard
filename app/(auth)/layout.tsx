import '@/app/globals.css'
import StoreProvider from '@/app/StoreProvider'
import ThemeProvider from '@/components/providers/ThemeProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main >
      <div>
        <StoreProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </StoreProvider>
      </div>
    </main>
  )
}
