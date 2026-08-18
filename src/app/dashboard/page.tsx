'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { 
  MessageSquareText, 
  CheckSquare, 
  CalendarClock, 
  CreditCard,
  Download,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const isLoading = false;
  const error = null;
  const metrics = {
    totalEnquiries: 150,
    convertedSales: 45,
    pendingFollowups: 12,
    outstandingPayments: 500000
  };

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return new Date().toLocaleDateString('en-GB', options);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Good morning! Here's what's happening — {formatDate()}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 rounded-xl border-border bg-background">
              <Download className="w-4 h-4" /> Export
            </Button>
            <Button className="gap-2 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20">
              <Plus className="w-4 h-4" /> New Enquiry
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-muted/50 animate-pulse" />
            ))
          ) : error ? (
            <div className="col-span-full p-4 text-center text-destructive bg-destructive/10 rounded-xl">
              Failed to load metrics. Please check your connection.
            </div>
          ) : (
            <>
              <MetricCard 
                label="Total Enquiries" 
                value={metrics?.totalEnquiries.toString() || "0"} 
                icon={MessageSquareText} 
                trend="+12%" 
                trendType="up" 
              />
              <MetricCard 
                label="Converted Sales" 
                value={metrics?.convertedSales.toString() || "0"} 
                icon={CheckSquare} 
                trend="+8%" 
                trendType="up" 
              />
              <MetricCard 
                label="Pending Followups" 
                value={metrics?.pendingFollowups.toString() || "0"} 
                icon={CalendarClock} 
                trend="-3%" 
                trendType="down" 
              />
              <MetricCard 
                label="Outstanding Payments" 
                value={`₹${((metrics?.outstandingPayments || 0) / 100000).toFixed(1)}L`} 
                icon={CreditCard} 
                trend="+5%" 
                trendType="up" 
              />
            </>
          )}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 gap-8">
          <div className="p-8 border rounded-2xl bg-card text-center text-muted-foreground">
             Dashboard metrics and recent activity will appear here. Navigate to Customers to view the CRM implementation.
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
