'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import CustomerList from '@/components/customers/CustomerList'

export default function CustomersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your contacts, view details, and track interactions.</p>
        </div>
        
        <CustomerList />
      </div>
    </DashboardLayout>
  )
}
