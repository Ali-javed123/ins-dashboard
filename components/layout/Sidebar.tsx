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
//   ChevronLeft
// } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { Button } from '@/components/ui/button'
// import { useAppSelector, useAppDispatch } from '@/lib/hooks'
// import { setSidebarOpen } from '@/lib/features/sidebar/sidebarSlice'
// import { useState } from 'react'
// import {  toggleSidebar } from '@/lib/features/sidebar/sidebarSlice'

// const navItems = [
//   { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
//   { icon: Users, label: 'Users', href: '/dashboard/users' },
//   { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
//   { icon: CreditCard, label: 'Billing', href: '/dashboard/billing' },
//   { icon: PieChart, label: 'Charts', href: '/dashboard/charts' },
//   { icon: FileText, label: 'Reports', href: '/dashboard/reports' },
//   { icon: Calendar, label: 'Calendar', href: '/dashboard/calendar' },
//   { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
// ]

// export default function Sidebar() {
//   const dispatch = useAppDispatch()
//   const isOpen = useAppSelector((state) => state.sidebar.isOpen)

//   const [activeItem, setActiveItem] = useState('Dashboard')

//   return (
//     <aside
//       className={cn(
//         'fixed inset-y-0 left-0 z-50 w-72 border-r bg-background transition-transform duration-300 lg:translate-x-0',
//         !isOpen && '-translate-x-full'
//       )}
//     >
//       <div className="flex h-full flex-col">
//         <div className="flex h-16 items-center justify-between border-b px-6">
//           <h2 className="text-xl font-semibold">Modern Dashboard</h2>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => dispatch(setSidebarOpen(false))}
//             className="hidden lg:flex"
//           >
//             <ChevronLeft className="h-5 w-5" />
//           </Button>
//         </div>

//         <nav className="flex-1 space-y-1 p-4">
//           {navItems.map((item) => (
//             <Button
//               key={item.label}
//               variant={activeItem === item.label ? 'secondary' : 'ghost'}
//               className={cn(
//                 'w-full justify-start',
//                 activeItem === item.label && 'bg-accent'
//               )}
//               onClick={() => setActiveItem(item.label)}
//             >
//               <item.icon className="mr-3 h-5 w-5" />
//               {item.label}
//             </Button>
//           ))}
//         </nav>

//         <div className="border-t p-4">
//           <Button variant="ghost" className="w-full justify-start text-destructive">
//             <LogOut className="mr-3 h-5 w-5" />
//             Logout
//           </Button>
//         </div>
//       </div>
//     </aside>
//   )
// }
// components/layout/Sidebar.tsx
'use client'

import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  FileText,
  CreditCard,
  PieChart,
  Calendar,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building,
  UserCog,
  Wallet,
  Shield,
  Briefcase,
  Folder,
  Database,
  MessageSquare,
  Bell,
  HelpCircle,
  Layers,
  FolderTree,
  ChevronDown,
  Plus,
  MoreVertical
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from '@/components/ui/accordion'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { setSidebarOpen, toggleSidebar } from '@/lib/features/sidebar/sidebarSlice'
import { useState } from 'react'

// Define types for navigation items
type NavItem = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: string | number
  isNew?: boolean
}

type NavCategory = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  items: NavItem[]
  isCollapsible?: boolean
  defaultOpen?: boolean
}

// Define navigation categories
const navCategories: NavCategory[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    items: [
      { id: 'overview', label: 'Overview', icon: Layers, href: '/dashboard' },
      { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics', badge: 'New', isNew: true },
      { id: 'reports', label: 'Reports', icon: FileText, href: '/dashboard/reports' },
    ]
  },
  {
    id: 'management',
    label: 'Management',
    icon: Users,
    items: [
      { id: 'users', label: 'Users', icon: UserCog, href: '/dashboard/users', badge: '24' },
      { id: 'teams', label: 'Teams', icon: Users, href: '/dashboard/teams' },
      { id: 'roles', label: 'Roles & Permissions', icon: Shield, href: '/dashboard/roles' },
      { id: 'departments', label: 'Departments', icon: Building, href: '/dashboard/departments' },
    ]
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: CreditCard,
    items: [
      { id: 'billing', label: 'Billing', icon: CreditCard, href: '/dashboard/billing' },
      { id: 'invoices', label: 'Invoices', icon: FileText, href: '/dashboard/invoices', badge: '3' },
      { id: 'transactions', label: 'Transactions', icon: Wallet, href: '/dashboard/transactions' },
      { id: 'tax', label: 'Tax Reports', icon: Briefcase, href: '/dashboard/tax' },
    ]
  },
  {
    id: 'content',
    label: 'Content',
    icon: Folder,
    items: [
      { id: 'posts', label: 'Posts', icon: FileText, href: '/dashboard/posts', badge: '12' },
      { id: 'media', label: 'Media Library', icon: Database, href: '/dashboard/media' },
      { id: 'categories', label: 'Categories', icon: FolderTree, href: '/dashboard/categories' },
    ]
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: MessageSquare,
    items: [
      { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/dashboard/messages', badge: '5' },
      { id: 'notifications', label: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
      { id: 'announcements', label: 'Announcements', icon: MessageSquare, href: '/dashboard/announcements' },
    ]
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: Settings,
    items: [
      { id: 'calendar', label: 'Calendar', icon: Calendar, href: '/dashboard/calendar' },
      { id: 'charts', label: 'Charts', icon: PieChart, href: '/dashboard/charts' },
      { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
      { id: 'help', label: 'Help Center', icon: HelpCircle, href: '/dashboard/help' },
    ]
  }
]

export default function Sidebar() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector((state) => state.sidebar.isOpen)
  const [activeItem, setActiveItem] = useState('overview')
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId)
  }

  const isCollapsed = (categoryId: string) => !collapsedCategories.includes(categoryId)

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
      'fixed inset-y-0 left-0 z-50 w-72 border-r bg-gradient-to-b from-background to-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 transition-all duration-300 ease-in-out lg:translate-x-0',
          !isOpen && '-translate-x-full' , 'shadow-lg', // Base shadow


        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-6 bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Layers className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-primary-foreground">
                  ModernDash
                </h2>
                <p className="text-xs text-muted-foreground">Professional Suite</p>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => dispatch(setSidebarOpen(false))}
                  className="hidden lg:flex hover:bg-primary/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Collapse sidebar</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* User Profile */}
          <div className="border-b p-4">
            <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors cursor-pointer">
              <Avatar className="h-9 w-9 border-2 border-background shadow-md">
                <AvatarImage src="/avatar.png" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                  AU
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
              </div>
              <Badge variant="outline" className="text-xs">
                Pro
              </Badge>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-2">
              {navCategories.map((category) => (
                <div key={category.id} className="space-y-1">
                  <Collapsible
                    open={isCollapsed(category.id)}
                    onOpenChange={() => toggleCategory(category.id)}
                    className="group"
                  >
                    <div className="flex items-center justify-between px-2 py-1">
                      <div className="flex items-center gap-2">
                        <category.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {category.label}
                        </span>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-accent"
                        >
                          <ChevronDown className={cn(
                            "h-3 w-3 transition-transform duration-200",
                            isCollapsed(category.id) ? "rotate-0" : "-rotate-90"
                          )} />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    
                    <CollapsibleContent className="space-y-1 pt-1">
                      {category.items.map((item) => (
                        <Tooltip key={item.id} delayDuration={0}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={activeItem === item.id ? "secondary" : "ghost"}
                              className={cn(
                                "w-full justify-start h-10 px-3 relative overflow-hidden group/item transition-all duration-200",
                                activeItem === item.id && "bg-primary/10 border-l-4 border-primary pl-2.5",
                                "hover:bg-accent hover:translate-x-1"
                              )}
                              onClick={() => handleItemClick(item.id)}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                  <item.icon className={cn(
                                    "h-4 w-4 transition-colors",
                                    activeItem === item.id ? "text-primary" : "text-muted-foreground"
                                  )} />
                                  <span className="text-sm font-medium">{item.label}</span>
                                </div>
                                {item.badge && (
                                  <Badge 
                                    variant={item.isNew ? "default" : "outline"} 
                                    className={cn(
                                      "text-xs h-5 px-1.5",
                                      item.isNew && "bg-gradient-to-r from-primary to-primary/70"
                                    )}
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              {activeItem === item.id && (
                                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-primary/70 rounded-r-full" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          {!isOpen && (
                            <TooltipContent side="right">
                              <p>{item.label}</p>
                              {item.badge && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                  <Separator className="my-2 opacity-50" />
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 mb-4">
              <div className="px-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Quick Actions
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs hover:bg-primary/10 hover:text-primary"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  New Task
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs hover:bg-primary/10 hover:text-primary"
                >
                  <FileText className="mr-1 h-3 w-3" />
                  Report
                </Button>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-4 bg-gradient-to-t from-background to-background/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">System Online</span>
              </div>
              <Badge variant="outline" className="text-xs">
                v2.5.1
              </Badge>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {/* Handle logout */}}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile toggle button */}
      {!isOpen && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => dispatch(setSidebarOpen(true))}
          className="fixed left-4 top-4 z-40 lg:hidden h-10 w-10 rounded-full shadow-lg border-primary/20 bg-background"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </TooltipProvider>
  )
}