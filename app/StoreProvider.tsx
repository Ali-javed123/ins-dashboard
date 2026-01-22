// app/StoreProvider.tsx
'use client'

import { useState } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@/lib/store'

interface StoreProviderProps {
  children: React.ReactNode
}

export default function StoreProvider({ children }: StoreProviderProps) {
  // Use useState instead of useRef for store initialization
  const [store] = useState<AppStore>(() => makeStore())

  return <Provider store={store}>{children}</Provider>
}