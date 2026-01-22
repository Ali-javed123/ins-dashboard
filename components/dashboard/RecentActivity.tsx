// components/dashboard/RecentActivity.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, CheckCircle, Clock, UserPlus, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function RecentActivity() {
  const activities = [
    {
      user: 'John Doe',
      action: 'New user registered',
      time: '2 minutes ago',
      icon: UserPlus,
      color: 'text-blue-600',
      status: 'success',
    },
    {
      user: 'Sarah Smith',
      action: 'Completed payment',
      time: '15 minutes ago',
      icon: CheckCircle,
      color: 'text-green-600',
      status: 'success',
    },
    {
      user: 'Michael Brown',
      action: 'Report submitted',
      time: '1 hour ago',
      icon: Activity,
      color: 'text-purple-600',
      status: 'pending',
    },
    {
      user: 'Emma Wilson',
      action: 'Failed login attempt',
      time: '2 hours ago',
      icon: AlertCircle,
      color: 'text-red-600',
      status: 'failed',
    },
    {
      user: 'Alex Johnson',
      action: 'Profile updated',
      time: '3 hours ago',
      icon: Clock,
      color: 'text-yellow-600',
      status: 'pending',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
              <div className={`p-2 rounded-full ${activity.color} bg-opacity-20`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.user}</p>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground">{activity.time}</span>
                <Badge 
                  variant={
                    activity.status === 'success' ? 'default' :
                    activity.status === 'pending' ? 'secondary' : 'destructive'
                  }
                  className="mt-1 text-xs"
                >
                  {activity.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}