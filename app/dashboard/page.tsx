// app/dashboard/page.tsx
import DashboardStats from '@/components/dashboard/DashboardStats'
import RecentActivity from '@/components/dashboard/RecentActivity'
import ChartsSection from '@/components/dashboard/ChartsSection'
import UserForm from '@/components/forms/UserForm'
import { DataTable } from '@/components/dashboard/DataTable'
import { columns, User } from '@/components/dashboard/Columns'

const sampleData: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "Active",
    role: "Admin",
    lastLogin: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Inactive",
    role: "User",
    lastLogin: "2024-01-10",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartsSection />
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">User Management</h3>
            <DataTable columns={columns} data={sampleData} />
          </div>
        </div>
        
        <div className="space-y-6">
          <RecentActivity />
          <UserForm />
        </div>
      </div>
    </div>
  )
}