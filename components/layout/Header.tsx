// components/layout/Header.tsx
'use client'

import { Bell, Search, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { toggleSidebar } from '@/lib/features/sidebar/sidebarSlice'
import { toggleTheme } from '@/lib/features/theme/themeSlice'
import { useSyncExternalStore, use, Suspense } from 'react'

// Simple client-only hook
function useIsClient() {
  const isClient = useSyncExternalStore(
    () => () => {}, // No-op subscribe
    () => true, // Client snapshot
    () => false // Server snapshot
  )
  return isClient
}

export default function Header() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.theme.mode)
  const isClient = useIsClient()

  // Get theme icon safely
  const themeIcon = isClient ? (theme === 'dark' ? '🌙' : '☀️') : '☀️'

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar())
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSidebarToggle}
            className="lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10"
              aria-label="Search"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            suppressHydrationWarning
          >
            <span suppressHydrationWarning>{themeIcon}</span>
          </Button>

          <Button 
            variant="ghost" 
            size="icon"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <Avatar>
            <AvatarImage src="/avatar.png" alt="User avatar" />
            <AvatarFallback aria-label="User">U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}