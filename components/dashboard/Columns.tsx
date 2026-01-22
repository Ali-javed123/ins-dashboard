// components/dashboard/columns.tsx
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'

export type User = {
  id: string
  name: string
  email: string
  status: 'Active' | 'Inactive' | 'Pending'
  role: 'Admin' | 'User' | 'Moderator'
  lastLogin: string
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      const email = row.original.email
      
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-sm">{name}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const email = row.getValue('email') as string
      return (
        <div className="text-sm">
          {email}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as User['status']
      
      const statusConfig = {
        Active: { 
          variant: 'default' as const, 
          icon: CheckCircle,
          className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
        },
        Inactive: { 
          variant: 'destructive' as const, 
          icon: XCircle,
          className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
        },
        Pending: { 
          variant: 'secondary' as const, 
          icon: null,
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
        },
      }

      const config = statusConfig[status]
      
      return (
        <Badge 
          variant={config.variant}
          className={`${config.className} flex items-center gap-1`}
        >
          {config.icon && <config.icon className="h-3 w-3" />}
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as User['role']
      
      const roleColors = {
        Admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        User: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        Moderator: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      }
      
      return (
        <Badge 
          variant="outline" 
          className={`${roleColors[role]} border-0`}
        >
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'lastLogin',
    header: 'Last Login',
    cell: ({ row }) => {
      const date = new Date(row.getValue('lastLogin'))
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      }
      
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{formatDate(date)}</span>
          <span className="text-xs text-muted-foreground">
            {diffDays === 0 ? 'Today' : `${diffDays} days ago`}
          </span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0 hover:bg-accent"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
              className="cursor-pointer"
            >
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit User
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]