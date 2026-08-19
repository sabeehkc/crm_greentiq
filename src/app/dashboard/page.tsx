"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import {
  Users,
  UserCheck,
  UserMinus,
  DollarSign,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomers, Customer } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const {
    data: customers = [],
    isLoading,
    isError: error,
  } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
    staleTime: 5 * 60 * 1000,
  });

  const activeCustomers = customers.filter(
    (c: Customer) => c.status === "Active",
  ).length;
  const inactiveCustomers = customers.filter(
    (c: Customer) => c.status === "Inactive",
  ).length;
  const totalPipeline = activeCustomers * 45000; // Mock $45k per active customer

  const recentCustomers = [...customers]
    .sort(
      (a, b) =>
        new Date(b.lastContactDate).getTime() -
        new Date(a.lastContactDate).getTime(),
    )
    .slice(0, 5);

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date().toLocaleDateString("en-GB", options);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Good morning! Here's what's happening — {formatDate()}
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-32 rounded-2xl bg-muted/50 animate-pulse"
                />
              ))
          ) : error ? (
            <div className="col-span-full p-4 text-center text-destructive bg-destructive/10 rounded-xl">
              Failed to load metrics. Please check your connection.
            </div>
          ) : (
            <>
              <MetricCard
                label="Total Customers"
                value={customers.length.toString()}
                icon={Users}
                trend="+12%"
                trendType="up"
              />
              <MetricCard
                label="Active Clients"
                value={activeCustomers.toString()}
                icon={UserCheck}
                trend="+8%"
                trendType="up"
              />
              <MetricCard
                label="Inactive / Archived"
                value={inactiveCustomers.toString()}
                icon={UserMinus}
                trend="-3%"
                trendType="down"
              />
              <MetricCard
                label="Pipeline Value"
                value={`$${(totalPipeline / 1000).toFixed(1)}k`}
                icon={DollarSign}
                trend="+5%"
                trendType="up"
              />
            </>
          )}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
                          <div className="h-3 w-1/4 bg-muted animate-pulse rounded" />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {recentCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(customer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {customer.name}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {customer.company}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          variant={
                            customer.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {customer.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(
                            customer.lastContactDate,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-8 border rounded-2xl bg-card text-center text-muted-foreground flex flex-col justify-center items-center h-full min-h-75">
            <p>Additional charts and analytics will appear here.</p>
            <p className="mt-2 text-sm opacity-70">
              Data is automatically synced with the Customers database.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
