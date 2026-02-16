// // components/layout/Sidebar.tsx
// 'use client'

// import { 
//   LayoutDashboard, 
//   Users, 
//   BarChart3, 
//   Settings, 
//   FileText,
//   CreditCard,
//   PieChart,
//   Calendar,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
//   Building,
//   UserCog,
//   Wallet,
//   Shield,
//   Briefcase,
//   Folder,
//   Database,
//   MessageSquare,
//   Bell,
//   HelpCircle,
//   Layers,
//   FolderTree,
//   ChevronDown,
//   ChevronUp,
//   Plus,
//   Home,
//   User,
//   Mail,
//   Phone,
//   Globe,
//   Image,
//   Info
// } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { Button } from '@/components/ui/button'
// import { 
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger 
// } from '@/components/ui/collapsible'
// import { 
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger 
// } from '@/components/ui/tooltip'
// import { Badge } from '@/components/ui/badge'
// import { Separator } from '@/components/ui/separator'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { useAppSelector, useAppDispatch } from '@/lib/hooks'
// import { setSidebarOpen } from '@/lib/features/sidebar/sidebarSlice'
// import { useState, useEffect } from 'react'
// import { useRouter, usePathname } from 'next/navigation'

// // Define types for navigation items
// type NavItemType = 'single' | 'dropdown';

// type NavItem = {
//   id: string
//   label: string
//   icon: React.ComponentType<{ className?: string }>
//   type: NavItemType
//   href?: string // For single items
//   items?: NavItem[] // For dropdown items
//   badge?: string | number
//   isNew?: boolean
// }

// // Define navigation items - Single और Dropdown दोनों mixed
// const navItems: NavItem[] = [
//   {
//     id: 'dashboard',
//     label: 'Dashboard',
//     icon: LayoutDashboard,
//     type: 'single',
//     href: '/dashboard'
//   },
//   {
//     id: 'Service',
//     label: 'services',
//     icon: Home,
//     type: 'dropdown',
//     items: [
//       {
//         id: 'home-banner',
//         label: 'Home Banner',
//         icon: Image,
//         type: 'single',
//         href: '/home/banner',
//         badge: '3'
//       },
//       {
//         id: 'hero-section',
//         label: 'Hero Section',
//         icon: Layers,
//         type: 'single',
//         href: '/home/hero'
//       },
//       {
//         id: 'features',
//         label: 'Features',
//         icon: Briefcase,
//         type: 'single',
//         href: '/home/features'
//       }
//     ]
//   },
//   {
//     id: 'homeBanner',
//     label: 'Home Banner',
//     icon: Users,
//     type: 'single',
//     href: '/home',
//     badge: '24'
//   },
//   {
//     id: 'aboutSection',
//     label: 'About section',
//     icon: Users,
//     type: 'single',
//     href: '/aboutsection',
//     badge: '25'
//   },
//   {
//     id: 'chooseus',
//     label: 'Choose Us',
//     icon: Users,
//     type: 'single',
//     href: '/chooseus',
//     badge: '26'
//   },
//   {
//     id: 'Services',
//     label: 'Services',
//     icon: Users,
//     type: 'single',
//     href: '/services',
//     badge: '27'
//   },
//   {
//     id: 'team',
//     label: 'Team',
//     icon: Users,
//     type: 'single',
//     href: '/teams',
//     badge: '28'
//   },
// ]

// export default function Sidebar() {
//   const dispatch = useAppDispatch()
//   const isOpen = useAppSelector((state) => state.sidebar.isOpen)
//   const [activeItem, setActiveItem] = useState('')
//   const [expandedItems, setExpandedItems] = useState<string[]>([])
//   const router = useRouter()
//   const pathname = usePathname()

//   // Find active item based on current pathname
// // Replace the problematic useEffect with:
// useEffect(() => {
//   let mounted = true
  
//   const findActiveItem = (items: NavItem[]): { activeId: string | null, expandedIds: string[] } => {
//     let activeId: string | null = null
//     const expandedIds: string[] = []
    
//     const traverse = (items: NavItem[], parentId?: string): boolean => {
//       for (const item of items) {
//         if (item.href && pathname === item.href) {
//           activeId = item.id
//           if (parentId) {
//             expandedIds.push(parentId)
//           }
//           return true
//         }
        
//         if (item.type === 'dropdown' && item.items) {
//           if (traverse(item.items, item.id)) {
//             if (parentId) {
//               expandedIds.push(parentId)
//             }
//             return true
//           }
//         }
//       }
//       return false
//     }
    
//     traverse(items)
//     return { activeId, expandedIds }
//   }

//   const { activeId, expandedIds } = findActiveItem(navItems)
  
//   // Update state in next tick
//   requestAnimationFrame(() => {
//     if (!mounted) return
    
//     if (activeId) {
//       setActiveItem(activeId)
//     }
    
//     if (expandedIds.length > 0) {
//       setExpandedItems(prev => {
//         const newSet = new Set([...prev, ...expandedIds])
//         return Array.from(newSet)
//       })
//     }
//   })

//   return () => {
//     mounted = false
//   }
// }, [pathname])
//   const toggleExpanded = (itemId: string) => {
//     setExpandedItems(prev =>
//       prev.includes(itemId)
//         ? prev.filter(id => id !== itemId)
//         : [...prev, itemId]
//     )
//   }

//   const isExpanded = (itemId: string) => expandedItems.includes(itemId)

//   const handleNavigate = (itemId: string, href?: string) => {
//     if (href) {
//       setActiveItem(itemId)
//       router.push(href)
//     }
//   }

//   // Check if item or any of its children is active
//   const isItemOrChildActive = (item: NavItem): boolean => {
//     if (activeItem === item.id) return true
    
//     if (item.type === 'dropdown' && item.items) {
//       return item.items.some(child => isItemOrChildActive(child))
//     }
    
//     return false
//   }

//   const renderNavItem = (item: NavItem, level: number = 0) => {
//     const isActive = activeItem === item.id
//     const hasChildren = item.type === 'dropdown' && item.items && item.items.length > 0
//     const expanded = isExpanded(item.id)
//     const itemOrChildActive = isItemOrChildActive(item)

//     return (
//       <div key={item.id} className="space-y-1">
//         {/* Main Item */}
//         <div className={cn(
//           "relative group",
//           level > 0 && "ml-4"
//         )}>
//           {item.type === 'single' ? (
//             // Single Link Item
//             <Tooltip delayDuration={0}>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant={isActive ? "secondary" : "ghost"}
//                   className={cn(
//                     "w-full justify-start h-10 px-3 relative overflow-hidden transition-all duration-200",
//                     isActive && "bg-primary/10 border-l-4 border-primary pl-2.5",
//                     "hover:bg-accent hover:translate-x-1",
//                     level > 0 && "text-sm"
//                   )}
//                   onClick={() => handleNavigate(item.id, item.href)}
//                 >
//                   <div className="flex items-center justify-between w-full">
//                     <div className="flex items-center gap-3">
//                       <item.icon className={cn(
//                         "h-4 w-4 transition-colors",
//                         isActive ? "text-primary" : "text-muted-foreground"
//                       )} />
//                       <span className="text-sm font-medium truncate">
//                         {item.label}
//                       </span>
//                     </div>
//                     {item.badge && (
//                       <Badge 
//                         variant="outline" 
//                         className="text-xs h-5 px-1.5 min-w-[20px]"
//                       >
//                         {item.badge}
//                       </Badge>
//                     )}
//                   </div>
//                   {isActive && (
//                     <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-primary/70 rounded-r-full" />
//                   )}
//                 </Button>
//               </TooltipTrigger>
//               {!isOpen && (
//                 <TooltipContent side="right">
//                   <p>{item.label}</p>
//                 </TooltipContent>
//               )}
//             </Tooltip>
//           ) : (
//             // Dropdown Item
//             <Collapsible
//               open={expanded}
//               onOpenChange={() => toggleExpanded(item.id)}
//               className="w-full"
//             >
//               <div className="flex items-center w-full">
//                 <CollapsibleTrigger asChild>
//                   <Button
//                     variant={itemOrChildActive || expanded ? "secondary" : "ghost"}
//                     className={cn(
//                       "flex-1 justify-start h-10 px-3 relative overflow-hidden group transition-all duration-200",
//                       (itemOrChildActive || expanded) && "bg-primary/5",
//                       "hover:bg-accent"
//                     )}
//                     onClick={(e) => {
//                       // If dropdown has a href, navigate to it
//                       if (item.href) {
//                         e.stopPropagation()
//                         handleNavigate(item.id, item.href)
//                       }
//                     }}
//                   >
//                     <div className="flex items-center justify-between w-full">
//                       <div className="flex items-center gap-3">
//                         <item.icon className={cn(
//                           "h-4 w-4 transition-colors",
//                           (itemOrChildActive || expanded) ? "text-primary" : "text-muted-foreground"
//                         )} />
//                         <span className="text-sm font-medium truncate">
//                           {item.label}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         {item.badge && (
//                           <Badge 
//                             variant="outline" 
//                             className="text-xs h-5 px-1.5 mr-1"
//                           >
//                             {item.badge}
//                           </Badge>
//                         )}
//                         <ChevronDown className={cn(
//                           "h-4 w-4 text-muted-foreground transition-transform duration-200",
//                           expanded ? "rotate-180" : ""
//                         )} />
//                       </div>
//                     </div>
//                     {itemOrChildActive && !expanded && (
//                       <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-primary/70 rounded-r-full" />
//                     )}
//                   </Button>
//                 </CollapsibleTrigger>
//               </div>

//               {/* Dropdown Content */}
//               {hasChildren && (
//                 <CollapsibleContent className="pt-1">
//                   <div className="space-y-1 border-l-2 border-border/50 ml-5 pl-2">
//                     {item.items?.map((childItem) => renderNavItem(childItem, level + 1))}
//                   </div>
//                 </CollapsibleContent>
//               )}
//             </Collapsible>
//           )}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <TooltipProvider delayDuration={0}>
//       <aside
//         className={cn(
//           'fixed inset-y-0 left-0 z-50 w-72 border-r bg-background transition-transform duration-300 lg:translate-x-0',
//           !isOpen && '-translate-x-full'
//         )}
//       >
//         <div className="flex h-full flex-col">
//           {/* Header */}
//           <div className="flex h-16 items-center justify-between border-b px-6">
//             <div className="flex items-center gap-3">
//               <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
//                 <Layers className="h-5 w-5 text-primary-foreground" />
//               </div>
//               <h2 className="text-lg font-semibold">Modern Dashboard</h2>
//             </div>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => dispatch(setSidebarOpen(false))}
//               className="hidden lg:flex"
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//           </div>

//           {/* User Profile */}
//           <div className="border-b p-4">
//             <div className="flex items-center gap-3">
//               <Avatar>
//                 <AvatarImage src="/avatar.png" />
//                 <AvatarFallback>AU</AvatarFallback>
//               </Avatar>
//               <div>
//                 <p className="text-sm font-medium">Admin User</p>
//                 <p className="text-xs text-muted-foreground">admin@example.com</p>
//               </div>
//             </div>
//           </div>

//           {/* Navigation */}
//           <ScrollArea className="flex-1 p-4">
//             <div className="space-y-1">
//               {navItems.map((item) => renderNavItem(item))}
//             </div>

//             {/* Separator */}
//             <Separator className="my-4" />

//             {/* Quick Links */}
//             <div className="space-y-1">
//               <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
//                 Quick Links
//               </div>
//               <Button
//                 variant="ghost"
//                 className="w-full justify-start h-9"
//                 onClick={() => handleNavigate('help', '/help')}
//               >
//                 <HelpCircle className="mr-3 h-4 w-4" />
//                 Help Center
//               </Button>
//               <Button
//                 variant="ghost"
//                 className="w-full justify-start h-9"
//                 onClick={() => handleNavigate('contact', '/contact')}
//               >
//                 <Mail className="mr-3 h-4 w-4" />
//                 Contact Support
//               </Button>
//             </div>
//           </ScrollArea>

//           {/* Footer */}
//           <div className="border-t p-4">
//             <Button
//               variant="ghost"
//               className="w-full justify-start text-destructive"
//               onClick={() => {/* Handle logout */}}
//             >
//               <LogOut className="mr-3 h-4 w-4" />
//               Logout
//             </Button>
//           </div>
//         </div>
//       </aside>

//       {/* Mobile toggle button */}
//       {!isOpen && (
//         <Button
//           variant="outline"
//           size="icon"
//           onClick={() => dispatch(setSidebarOpen(true))}
//           className="fixed left-4 top-4 z-40 lg:hidden"
//         >
//           <ChevronRight className="h-4 w-4" />
//         </Button>
//       )}
//     </TooltipProvider>
//   )
// }


// components/layout/Sidebar.tsx
// components/layout/Sidebar.tsx
'use client'

import { 
  LayoutDashboard, 
  Users, 
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  HelpCircle,
  Layers,
  ChevronDown,
  Plus,
  Home,
  Mail,
  Image,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from '@/components/ui/collapsible'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { setSidebarOpen, toggleSidebar } from '@/lib/features/sidebar/sidebarSlice'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from "@/lib/supabase-client"
import { toast } from "sonner";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

// Define types for navigation items
type NavItemType = 'single' | 'dropdown';

type NavItem = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  type: NavItemType
  href?: string
  items?: NavItem[]
  badge?: string | number
  isNew?: boolean
}

// Navigation items
const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    type: 'single',
    href: '/dashboard'
  },
  
  {
    id: 'homeBanner',
    label: 'Home Banner',
    icon: Users,
    type: 'single',
    href: '/home',
    badge: '24'
  },
  {
    id: 'aboutSection',
    label: 'About section',
    icon: Users,
    type: 'single',
    href: '/aboutsection',
    badge: '25'
  },
  {
    id: 'chooseus',
    label: 'Choose Us',
    icon: Users,
    type: 'single',
    href: '/chooseus',
    badge: '26'
  },
  {
    id: 'Services',
    label: 'Services',
    icon: Users,
    type: 'single',
    href: '/services',
    badge: '27'
  },
  {
    id: 'team',
    label: 'Team',
    icon: Users,
    type: 'single',
    href: '/teams',
    badge: '28'
  },
  {
    id: 'ourbanefits',
    label: 'Our Banefits',
    icon: Users,
    type: 'single',
    href: '/ourbanefit',
    badge: '29'
  },
   {
    id: 'Projects',
    label: 'Projects',
    icon: Users,
    type: 'single',
    href: '/projects',
    badge: '30'
  },
  {
    id: 'Testimonial',
    label: 'Testimonial',
    icon: Users,
    type: 'single',
    href: '/testimonials',
    badge: '31'
  },
  {
    id: 'Faqs',
    label: 'Faqs',
    icon: Users,
    type: 'single',
    href: '/faqs',
    badge: '32'
  },
  {
    id: 'Service',
    label: 'services',
    icon: Home,
    type: 'dropdown',
    items: [
      {
        id: 'Service-Detail-One',
        label: 'Service Detail One',
        icon: LayoutDashboard,
        type: 'single',
        href: '/services/serviceone',
        badge: '1'
      },
      {
        id: 'Service-Detail-Two',
        label: 'Service Detail Two',
        icon: LayoutDashboard,
        type: 'single',
        href: '/services/servicetwo',
        badge: '2'
      },
          {
        id: 'Service-Detail-Three',
        label: 'Service Detail Three',
        icon: LayoutDashboard,
        type: 'single',
        href: '/services/service_detail_three',
        badge: '3'
      },
      {
        id: 'Service-Detail-Four',
        label: 'Service Detail Four',
        icon: LayoutDashboard,
        type: 'single',
        href: '/services/service_detail_four',
        badge: '4'
      },
      {
        id: 'service_five',
        label: 'Service Detail Five',
        icon: LayoutDashboard,
        type: 'single',
        href: '/services/service_five',
        badge: '5'
      },
       {
        id: 'Sevice-faqs',
        label: 'Service Detail Faqs',
        icon: LayoutDashboard,
        type: 'single',
        href: '/services/faqs',
        badge: '5'
      },
      
     
    ]
  },
  
]

export default function Sidebar() {
  
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

    
const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // setUserSession(null);
      router.push('/')
      localStorage.removeItem("supabaseSession");
                toast.success("Logged out successfully!", {
              icon: <CheckCircle className="text-green-500" />,
            });
    }
    catch (error: unknown) {
  console.error("Logout failed:", error);

  let errorMessage = "Logout failed";

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    errorMessage = (error as { message: string }).message;
  }

  toast.error(errorMessage, {
    icon: <XCircle className="text-red-500" />,
  });
}
  };
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector((state) => state.sidebar.isOpen)
  const [activeItem, setActiveItem] = useState('')
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const pathnameRef = useRef(pathname)
  const isInitialMount = useRef(true)

  // Check device type ONLY on mount
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      setIsMobile(width < 1024) // Mobile = less than 1024px (lg breakpoint)
    }

    checkDevice()
    
    // Initial setup: Desktop par open, mobile par closed
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      if (width >= 1024) {
        // Desktop
        if (!isOpen) {
          setTimeout(() => dispatch(setSidebarOpen(true)), 0)
        }
      } else {
        // Mobile/Tablet
        if (isOpen) {
          setTimeout(() => dispatch(setSidebarOpen(false)), 0)
        }
      }
    }

    window.addEventListener('resize', checkDevice)
    
    return () => {
      window.removeEventListener('resize', checkDevice)
    }
  }, []) // Empty dependency array - runs only once

  // Find active item based on current pathname
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    // Debounce the state updates
    const timeoutId = setTimeout(() => {
      const findActiveItem = (items: NavItem[]): { activeId: string | null, expandedIds: string[] } => {
        let activeId: string | null = null
        const expandedIds: string[] = []
        
        const traverse = (items: NavItem[], parentId?: string): boolean => {
          for (const item of items) {
            if (item.href && pathname === item.href) {
              activeId = item.id
              if (parentId) {
                expandedIds.push(parentId)
              }
              return true
            }
            
            if (item.type === 'dropdown' && item.items) {
              if (traverse(item.items, item.id)) {
                if (parentId) {
                  expandedIds.push(parentId)
                }
                return true
              }
            }
          }
          return false
        }
        
        traverse(items)
        return { activeId, expandedIds }
      }

      const { activeId, expandedIds } = findActiveItem(navItems)
      
      // Update states
      if (activeId && activeItem !== activeId) {
        setActiveItem(activeId)
      }
      
      if (expandedIds.length > 0) {
        setExpandedItems(prev => {
          const newSet = new Set([...prev, ...expandedIds])
          return Array.from(newSet)
        })
      }
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [pathname])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const isExpanded = (itemId: string) => expandedItems.includes(itemId)

  const handleNavigate = (itemId: string, href?: string) => {
    if (href) {
      setActiveItem(itemId)
      router.push(href)
      
      // Auto close sidebar on mobile after navigation
      if (isMobile) {
        setTimeout(() => {
          dispatch(setSidebarOpen(false))
        }, 100)
      }
    }
  }

  const isItemOrChildActive = (item: NavItem): boolean => {
    if (activeItem === item.id) return true
    
    if (item.type === 'dropdown' && item.items) {
      return item.items.some(child => isItemOrChildActive(child))
    }
    
    return false
  }

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const isActive = activeItem === item.id
    const hasChildren = item.type === 'dropdown' && item.items && item.items.length > 0
    const expanded = isExpanded(item.id)
    const itemOrChildActive = isItemOrChildActive(item)

    return (
      <div key={item.id} className="space-y-1">
        {/* Main Item */}
        <div className={cn(
          "relative group",
          level > 0 && "ml-4"
        )}>
          {item.type === 'single' ? (
            // Single Link Item
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-10 px-3 relative overflow-hidden transition-all duration-200",
                    isActive && "bg-primary/10 border-l-4 border-primary pl-2.5",
                    "hover:bg-accent hover:translate-x-1",
                    level > 0 && "text-sm"
                  )}
                  onClick={() => handleNavigate(item.id, item.href)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <item.icon className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} />
                      <span className="text-sm font-medium truncate">
                        {item.label}
                      </span>
                    </div>
                    {item.badge && (
                      <Badge 
                        variant="outline" 
                        className="text-xs h-5 px-1.5 min-w-[20px]"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  {isActive && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-primary/70 rounded-r-full" />
                  )}
                </Button>
              </TooltipTrigger>
              {!isOpen && (
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ) : (
            // Dropdown Item
            <Collapsible
              open={expanded}
              onOpenChange={() => toggleExpanded(item.id)}
              className="w-full"
            >
              <div className="flex items-center w-full">
                <CollapsibleTrigger asChild>
                  <Button
                    variant={itemOrChildActive || expanded ? "secondary" : "ghost"}
                    className={cn(
                      "flex-1 justify-start h-10 px-3 relative overflow-hidden group transition-all duration-200",
                      (itemOrChildActive || expanded) && "bg-primary/5",
                      "hover:bg-accent"
                    )}
                    onClick={(e) => {
                      if (item.href) {
                        e.stopPropagation()
                        handleNavigate(item.id, item.href)
                      }
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <item.icon className={cn(
                          "h-4 w-4 transition-colors",
                          (itemOrChildActive || expanded) ? "text-primary" : "text-muted-foreground"
                        )} />
                        <span className="text-sm font-medium truncate">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {item.badge && (
                          <Badge 
                            variant="outline" 
                            className="text-xs h-5 px-1.5 mr-1"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronDown className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform duration-200",
                          expanded ? "rotate-180" : ""
                        )} />
                      </div>
                    </div>
                    {itemOrChildActive && !expanded && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-primary/70 rounded-r-full" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>

              {/* Dropdown Content */}
              {hasChildren && (
                <CollapsibleContent className="pt-1">
                  <div className="space-y-1 border-l-2 border-border/50 ml-5 pl-2">
                    {item.items?.map((childItem) => renderNavItem(childItem, level + 1))}
                  </div>
                </CollapsibleContent>
              )}
            </Collapsible>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}
      
      <TooltipProvider delayDuration={0}>
        <aside
          className={cn(
            // Base styles
            'fixed inset-y-0 left-0 z-50 w-72 border-r bg-[hsl(var(--color-background))] dark:bg-[hsl(var(--color-background))] shadow-lg',
            'transform transition-all duration-300 ease-in-out',
            
            // Desktop: Always visible
            'lg:translate-x-0',
            
            // Mobile: Slide in/out
            isOpen ? 'translate-x-0' : '-translate-x-full',
            
            // Shadows for mobile
            isMobile && 'shadow-2xl'
          )}
        >
          <div className="flex h-full flex-col">
            {/* Header with close button */}
            <div className="flex h-16 items-center justify-between border-b px-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Layers className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-lg font-semibold">Modern Dashboard</h2>
              </div>
              
              {/* Close button for mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch(setSidebarOpen(false))}
                className="lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </Button>
              
              {/* Toggle button for desktop */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch(toggleSidebar())}
                className="hidden lg:flex"
                aria-label="Toggle sidebar"
              >
                <ChevronLeft className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen ? "" : "rotate-180"
                )} />
              </Button>
            </div>

            {/* User Profile */}
            <div className="border-b p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@example.com</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-1">
                {navItems.map((item) => renderNavItem(item))}
              </div>

              <Separator className="my-4" />

              {/* Quick Links */}
              <div className="space-y-1">
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                  Quick Links
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9"
                  onClick={() => handleNavigate('help', '/help')}
                >
                  <HelpCircle className="mr-3 h-4 w-4" />
                  Help Center
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9"
                  onClick={() => handleNavigate('contact', '/contact')}
                >
                  <Mail className="mr-3 h-4 w-4" />
                  Contact Support
                </Button>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t p-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive"
                onClick={() => handleLogout()}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>
      </TooltipProvider>
    </>
  )
}