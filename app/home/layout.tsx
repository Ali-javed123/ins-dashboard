// // app/layout.tsx
// 'use client'

// import Sidebar from '@/components/layout/Sidebar'
// import Header from '@/components/layout/Header'
// import Footer from '@/components/layout/Footer'

// export default function HomeLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <div className="min-h-screen bg-background">
//       <Sidebar />
//       <div className="lg:pl-72">
//         <Header />
//         <main className="py-10">
//           <div className="px-4 sm:px-6 lg:px-8">
//             {children}
//           </div>
//         </main>
//         <Footer />
//       </div>
//     </div>
//   )
// }



// app/layout.tsx
// app/layout.tsx ya home layout
'use client'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useAppSelector } from '@/lib/hooks'
import { useEffect, useState } from 'react'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isOpen = useAppSelector((state) => state.sidebar.isOpen)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)

    return () => {
      window.removeEventListener('resize', checkDevice)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[hsl(var(--color-background))] 
    dark:bg-[hsl(var(--color-background))]">
      <Sidebar />
      
      {/* Main Content */}
      <div className={`
        transition-all duration-300
        ${isOpen ? 'lg:ml-72' : 'lg:ml-0'}
        ${isMobile ? 'w-full ml-0' : ''}
      `}>
        <Header />
        
        <main className="py-8 lg:py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  )
}