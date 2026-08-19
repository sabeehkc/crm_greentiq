"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import logo from "../../../public/crm-logo.png";

export const menuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  { id: "customers", icon: Users, label: "Customers", href: "/customers" },
];

interface SidebarProps {
  isMobileExpanded: boolean;
  setIsMobileExpanded: (expanded: boolean) => void;
}

export function Sidebar({
  isMobileExpanded,
  setIsMobileExpanded,
}: SidebarProps) {
  const pathname = usePathname();

  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "AD";
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileExpanded && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileExpanded(false)}
        />
      )}
      <aside
        className={cn(
          "border-r bg-sidebar h-screen sticky top-0 flex flex-col transition-all duration-300 z-40 shrink-0",
          isMobileExpanded ? "w-64 absolute md:relative" : "w-16 md:w-64",
        )}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b h-20">
          <img
            src={logo.src}
            alt="Logo"
            className="w-8 h-8 rounded-xl object-contain shrink-0"
          />
          <div
            className={cn(
              "overflow-hidden whitespace-nowrap transition-opacity",
              !isMobileExpanded && "opacity-0 md:opacity-100 hidden md:block",
            )}
          >
            <h1 className="font-bold text-lg leading-tight text-foreground">
              CRM
            </h1>
            <p className="text-xs text-muted-foreground">CRM Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  !isMobileExpanded &&
                    "justify-center md:justify-start px-0 md:px-3",
                )}
                title={!isMobileExpanded ? item.label : undefined}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 shrink-0",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-primary",
                  )}
                />
                <span
                  className={cn(
                    "overflow-hidden whitespace-nowrap",
                    !isMobileExpanded && "hidden md:block",
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div
                    className={cn(
                      "absolute right-3 w-1.5 h-1.5 rounded-full bg-primary",
                      !isMobileExpanded && "hidden md:block",
                    )}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t mt-auto">
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl bg-muted/50",
              !isMobileExpanded &&
                "justify-center md:justify-start bg-transparent md:bg-muted/50",
            )}
          >
            <Avatar className="h-10 w-10 border-2 border-background shrink-0">
              <AvatarFallback className="bg-primary text-white">
                {getInitials("Admin User")}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "flex-1 min-w-0",
                !isMobileExpanded && "hidden md:block",
              )}
            >
              <p className="text-sm font-semibold truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate capitalize">
                Administrator
              </p>
            </div>
            <button
              className={cn(
                "text-muted-foreground hover:text-foreground shrink-0",
                !isMobileExpanded && "hidden md:block",
              )}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
