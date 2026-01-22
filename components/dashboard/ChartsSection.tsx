// components/dashboard/ChartsSection.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart3, 
  LineChart, 
  TrendingUp,
  MoreVertical,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { useEffect, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { Skeleton } from '@/components/ui/skeleton'

// Types definitions
interface RevenueDataPoint {
  month: string;
  revenue: number;
  users: number;
  expenses: number;
}

interface TrafficDataPoint {
  name: string;
  visits: number;
  clicks: number;
  conversions: number;
}

interface GrowthDataPoint {
  month: string;
  revenue: number;
  users: number;
  growthRate: number;
}

// Utility functions for generating random data
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRevenueData(): RevenueDataPoint[] {
  return months.slice(0, 7).map((month) => ({
    month,
    revenue: generateRandomNumber(3000, 10000),
    users: generateRandomNumber(1000, 5000),
    expenses: generateRandomNumber(1000, 4000),
  }));
}

function generateTrafficData(): TrafficDataPoint[] {
  return weekDays.map((day) => ({
    name: day,
    visits: generateRandomNumber(2000, 8000),
    clicks: generateRandomNumber(1000, 6000),
    conversions: generateRandomNumber(100, 2000),
  }));
}

function generateGrowthData(): GrowthDataPoint[] {
  return months.slice(0, 7).map((month) => ({
    month,
    revenue: generateRandomNumber(3000, 10000),
    users: generateRandomNumber(1000, 5000),
    growthRate: generateRandomNumber(5, 25) / 100,
  }));
}

// Dynamically import recharts components
const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);

const BarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart),
  { ssr: false }
);

const Bar = dynamic(
  () => import('recharts').then((mod) => mod.Bar),
  { ssr: false }
);

const XAxis = dynamic(
  () => import('recharts').then((mod) => mod.XAxis),
  { ssr: false }
);

const YAxis = dynamic(
  () => import('recharts').then((mod) => mod.YAxis),
  { ssr: false }
);

const CartesianGrid = dynamic(
  () => import('recharts').then((mod) => mod.CartesianGrid),
  { ssr: false }
);

const Tooltip = dynamic(
  () => import('recharts').then((mod) => mod.Tooltip),
  { ssr: false }
);

const LineChartComponent = dynamic(
  () => import('recharts').then((mod) => mod.LineChart),
  { ssr: false }
);

const Line = dynamic(
  () => import('recharts').then((mod) => mod.Line),
  { ssr: false }
);

const AreaChartComponent = dynamic(
  () => import('recharts').then((mod) => mod.AreaChart),
  { ssr: false }
);

const Area = dynamic(
  () => import('recharts').then((mod) => mod.Area),
  { ssr: false }
);

// Custom Tooltip Props Interface
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
    payload: RevenueDataPoint | TrafficDataPoint | GrowthDataPoint;
  }>;
  label?: string;
  colors: {
    background: string;
    foreground: string;
    mutedForeground: string;
    border: string;
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
  };
}

// Custom Tooltip Component
function CustomTooltip({ active, payload, label, colors }: CustomTooltipProps): React.ReactElement | null {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div 
      className="rounded-lg border p-3 shadow-lg"
      style={{ 
        backgroundColor: colors.background,
        borderColor: colors.border,
      }}
    >
      <p className="font-medium" style={{ color: colors.foreground }}>
        {label}
      </p>
      {payload.map((entry, index) => (
        <p 
          key={`item-${index}`} 
          className="text-sm flex items-center gap-2"
          style={{ color: colors.mutedForeground }}
        >
          <span 
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}: <span style={{ color: colors.foreground }}>
            {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}

// Main Component
export default function ChartsSection(): React.ReactElement {
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficDataPoint[]>([]);
  const [growthData, setGrowthData] = useState<GrowthDataPoint[]>([]);
  const { theme, systemTheme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Handle hydration - wait for client-side only
  useEffect(() => {
    setIsHydrated(true);
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Generate initial data
        setRevenueData(generateRevenueData());
        setTrafficData(generateTrafficData());
        setGrowthData(generateGrowthData());
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const generateNewData = useCallback(async (): Promise<void> => {
    if (!isHydrated) return;
    
    setIsLoading(true);
    try {
      // Simulate async data generation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Batch all state updates together
      setRevenueData(generateRevenueData());
      setTrafficData(generateTrafficData());
      setGrowthData(generateGrowthData());
    } catch (error) {
      console.error('Error generating data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isHydrated]);

  // Get theme colors
  const getThemeColors = () => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDark = currentTheme === 'dark';
    return {
      background: isDark ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
      foreground: isDark ? 'hsl(210 40% 98%)' : 'hsl(222.2 84% 4.9%)',
      primary: isDark ? '#3b82f6' : '#2563eb',
      secondary: isDark ? '#10b981' : '#059669',
      tertiary: isDark ? '#8b5cf6' : '#7c3aed',
      muted: isDark ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(210 40% 96.1%)',
      mutedForeground: isDark ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)',
      border: isDark ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)',
    };
  };

  const colors = getThemeColors();

  // Show loading skeleton until hydrated and data loaded
  if (!isHydrated || isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-end">
          <div className="h-9 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-200 dark:bg-gray-700 rounded" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-200 dark:bg-gray-700 rounded" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-gray-200 dark:bg-gray-700 rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate summary data
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalVisits = trafficData.reduce((sum, item) => sum + item.visits, 0);
  const avgGrowthRate = growthData.length > 0 
    ? (growthData.reduce((sum, item) => sum + item.growthRate, 0) / growthData.length) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => generateNewData()}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Generating...' : 'Generate New Data'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Revenue
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await new Promise(resolve => setTimeout(resolve, 300));
                    setRevenueData(generateRevenueData());
                  } finally {
                    setIsLoading(false);
                  }
                }}
                title="Refresh Revenue Data"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={colors.muted} 
                    strokeOpacity={0.3}
                  />
                  <XAxis 
                    dataKey="month" 
                    stroke={colors.mutedForeground}
                    fontSize={12}
                    tick={{ fill: colors.mutedForeground }}
                  />
                  <YAxis 
                    stroke={colors.mutedForeground}
                    fontSize={12}
                    tick={{ fill: colors.mutedForeground }}
                    tickFormatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip colors={colors} />} />
                  <Bar 
                    dataKey="revenue" 
                    name="Revenue"
                    fill={colors.primary}
                    fillOpacity={0.8}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="expenses" 
                    name="Expenses"
                    fill="#ef4444"
                    fillOpacity={0.6}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Traffic Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Website Traffic
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await new Promise(resolve => setTimeout(resolve, 300));
                    setTrafficData(generateTrafficData());
                  } finally {
                    setIsLoading(false);
                  }
                }}
                title="Refresh Traffic Data"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChartComponent data={trafficData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={colors.muted}
                    strokeOpacity={0.3}
                  />
                  <XAxis 
                    dataKey="name" 
                    stroke={colors.mutedForeground}
                    fontSize={12}
                    tick={{ fill: colors.mutedForeground }}
                  />
                  <YAxis 
                    stroke={colors.mutedForeground}
                    fontSize={12}
                    tick={{ fill: colors.mutedForeground }}
                  />
                  <Tooltip content={<CustomTooltip colors={colors} />} />
                  <Line 
                    type="monotone" 
                    dataKey="visits" 
                    name="Visits"
                    stroke={colors.primary} 
                    strokeWidth={2}
                    dot={{ 
                      r: 4,
                      fill: colors.primary,
                      stroke: colors.background,
                      strokeWidth: 2
                    }}
                    activeDot={{ 
                      r: 6,
                      fill: colors.primary,
                      stroke: colors.background,
                      strokeWidth: 2
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    name="Clicks"
                    stroke={colors.secondary} 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ 
                      r: 4,
                      fill: colors.secondary,
                      stroke: colors.background,
                      strokeWidth: 2
                    }}
                  />
                </LineChartComponent>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Area Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Growth Overview
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                setIsLoading(true);
                try {
                  await new Promise(resolve => setTimeout(resolve, 300));
                  setGrowthData(generateGrowthData());
                } finally {
                  setIsLoading(false);
                }
              }}
              title="Refresh Growth Data"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChartComponent data={growthData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={colors.muted}
                  strokeOpacity={0.3}
                />
                <XAxis 
                  dataKey="month" 
                  stroke={colors.mutedForeground}
                  fontSize={12}
                  tick={{ fill: colors.mutedForeground }}
                />
                <YAxis 
                  stroke={colors.mutedForeground}
                  fontSize={12}
                  tick={{ fill: colors.mutedForeground }}
                  tickFormatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Tooltip content={<CustomTooltip colors={colors} />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue"
                  stroke={colors.primary} 
                  fill={colors.primary}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  name="Users"
                  stroke={colors.secondary} 
                  fill={colors.secondary}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChartComponent>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold mt-2">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Total Visits</p>
              <p className="text-2xl font-bold mt-2">
                {totalVisits.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Avg Growth Rate</p>
              <p className="text-2xl font-bold mt-2">
                {avgGrowthRate.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}