import React from 'react'
import { Customer } from '@/lib/api'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Copy, BarChart2 } from 'lucide-react'

interface CustomerDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer | null
  onEdit: (customer: Customer) => void
  onDelete: (id: string) => void
}

export function CustomerDetailsModal({ isOpen, onClose, customer, onEdit, onDelete }: CustomerDetailsModalProps) {
  if (!customer) return null

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-150 p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-4 sm:p-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-xl font-semibold">Customer Details</DialogTitle>
        </DialogHeader>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 overflow-y-auto">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xl">
                  {getInitials(customer.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-xl font-bold">{customer.name}</h2>
                </div>
                <p className="text-muted-foreground text-sm mb-1">Marketing Director</p>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <BarChart2 className="w-4 h-4" />
                  <span>{customer.company}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
              <Button 
                variant="destructive" 
                className="h-9 flex-1 sm:flex-none" 
                onClick={() => { onDelete(customer.id); onClose(); }}
              >
                Delete
              </Button>
              <Button 
                className="h-9 flex-1 sm:flex-none" 
                onClick={() => { onEdit(customer); onClose(); }}
              >
                Edit Customer
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Contact Information */}
            <div className="space-y-5">
              <h3 className="text-[15px] font-semibold text-foreground">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-sm mb-1.5">Email</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-foreground break-all">{customer.email}</p>
                    <button onClick={() => navigator.clipboard.writeText(customer.email)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1.5">Phone</p>
                  <p className="text-sm text-foreground">{customer.phone}</p>
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-[15px] font-semibold text-foreground mb-5">Timelines</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1.5">Last Contact</p>
                    <p className="text-sm text-foreground">
                      {new Date(customer.lastContactDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, 2:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company & Status */}
            <div className="space-y-5">
              <h3 className="text-[15px] font-semibold text-foreground">Company & Status</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-sm mb-1.5">Company</p>
                  <p className="text-sm text-foreground">{customer.company}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1.5">Status</p>
                  <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'}>
                    {customer.status} {customer.status === 'Active' ? 'Client' : ''}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1.5">Deal Value</p>
                  <p className="text-sm text-foreground">$45,000</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1.5">Account Owner</p>
                  <p className="text-sm text-foreground">Sarah Chen</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1.5">Created Date</p>
                  <p className="text-sm text-foreground">Jan 10, 2022</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Interactions */}
          <div className="space-y-3 pt-4">
            <h3 className="text-[15px] font-semibold text-foreground">Notes & Interactions</h3>
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-foreground flex justify-between border min-h-20">
              <p className="pr-8 leading-relaxed max-w-[85%]">{customer.notes || "Met at TechCrunch Disrupt. Discussed Q4 marketing campaign. Sent proposal. Very engaged. Next meeting scheduled for Oct 20th."}</p>
              <span className="text-muted-foreground shrink-0 whitespace-nowrap text-xs mt-0.5">
                {new Date(customer.lastContactDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
