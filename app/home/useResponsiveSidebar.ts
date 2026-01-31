// hooks/useResponsiveSidebar.ts
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { setSidebarOpen } from '@/lib/features/sidebar/sidebarSlice'
import { useEffect, useState } from 'react'

export function useResponsiveSidebar() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector((state) => state.sidebar.isOpen)
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      
      if (width < 768) {
        setDeviceType('mobile')
        if (isOpen) {
          dispatch(setSidebarOpen(false))
        }
      } else if (width >= 768 && width < 1024) {
        setDeviceType('tablet')
        if (isOpen) {
          dispatch(setSidebarOpen(false))
        }
      } else {
        setDeviceType('desktop')
        if (!isOpen) {
          dispatch(setSidebarOpen(true))
        }
      }
    }

    // Initial check
    handleResize()

    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [dispatch, isOpen])

  const toggleSidebar = () => {
    dispatch(setSidebarOpen(!isOpen))
  }

  const closeSidebar = () => {
    if (deviceType !== 'desktop') {
      dispatch(setSidebarOpen(false))
    }
  }

  return {
    isOpen,
    deviceType,
    toggleSidebar,
    closeSidebar,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop'
  }
}