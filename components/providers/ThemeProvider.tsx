// components/providers/ThemeProvider.tsx
'use client'

import { useEffect } from 'react'
import { useAppSelector } from '@/lib/hooks'

export default function ThemeProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const theme = useAppSelector((state) => state.theme.mode)

  useEffect(() => {
    const root = document.documentElement
    
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', isDark)
    } else {
      root.classList.toggle('dark', theme === 'dark')
    }
  }, [theme])

  return <>{children}</>
}