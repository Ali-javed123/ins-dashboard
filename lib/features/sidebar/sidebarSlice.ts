// // lib/features/sidebar/sidebarSlice.ts
// import { createSlice } from '@reduxjs/toolkit'

// interface SidebarState {
//   isOpen: boolean
// }

// const initialState: SidebarState = {
//   isOpen: true,
// }

// const sidebarSlice = createSlice({
//   name: 'sidebar',
//   initialState,
//   reducers: {
//     toggleSidebar: (state) => {
//       state.isOpen = !state.isOpen
//     },
//     setSidebarOpen: (state, action) => {
//       state.isOpen = action.payload
//     },
//   },
// })

// export const { toggleSidebar, setSidebarOpen } = sidebarSlice.actions
// export default sidebarSlice.reducer


// lib/features/sidebar/sidebarSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SidebarState {
  isOpen: boolean
}

// Check localStorage for initial state on client side
const getInitialState = (): SidebarState => {
  if (typeof window !== 'undefined') {
    // Check screen size on initial load
    const isDesktop = window.innerWidth >= 1024
    return {
      isOpen: isDesktop // Desktop par open, mobile par closed
    }
  }
  return {
    isOpen: true // Default fallback
  }
}

const initialState: SidebarState = getInitialState()

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload
    },
    // Mobile-specific actions
    openSidebar: (state) => {
      state.isOpen = true
    },
    closeSidebar: (state) => {
      state.isOpen = false
    }
  },
})

export const { toggleSidebar, setSidebarOpen, openSidebar, closeSidebar } = sidebarSlice.actions
export default sidebarSlice.reducer