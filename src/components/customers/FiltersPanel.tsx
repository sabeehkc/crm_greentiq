"use client";

import React, { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, AtSign, Star, X } from "lucide-react";
import { AdvancedFilters } from "./CustomerList";

interface FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters: AdvancedFilters;
  onApply: (filters: AdvancedFilters) => void;
}

export function FiltersPanel({
  isOpen,
  onClose,
  initialFilters,
  onApply,
}: FiltersPanelProps) {
  const [draft, setDraft] = React.useState<AdvancedFilters>(initialFilters);
  const [companyInput, setCompanyInput] = React.useState("");

  React.useEffect(() => {
    if (isOpen) setDraft(initialFilters);
  }, [isOpen, initialFilters]);

  const handleApply = () => {
    onApply(draft);
  };

  const handleClear = () => {
    const emptyFilters = {
      statuses: [],
      companies: [],
      dateFrom: "",
      dateTo: "",
      phone: "",
      email: "",
    };
    setDraft(emptyFilters);
    onApply(emptyFilters);
  };

  const toggleStatus = (statusLabel: string) => {
    const actualStatus =
      statusLabel.includes("Active") && !statusLabel.includes("Inactive")
        ? "Active"
        : statusLabel.includes("Inactive")
          ? "Inactive"
          : null;

    if (!actualStatus) return;

    setDraft((prev) => {
      const current = prev.statuses;
      if (current.includes(actualStatus)) {
        return { ...prev, statuses: current.filter((s) => s !== actualStatus) };
      } else {
        return { ...prev, statuses: [...current, actualStatus] };
      }
    });
  };

  const handleCompanyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && companyInput.trim()) {
      e.preventDefault();
      if (!draft.companies.includes(companyInput.trim())) {
        setDraft((prev) => ({
          ...prev,
          companies: [...prev.companies, companyInput.trim()],
        }));
      }
      setCompanyInput("");
    }
  };

  const removeCompany = (company: string) => {
    setDraft((prev) => ({
      ...prev,
      companies: prev.companies.filter((c) => c !== company),
    }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-87.5 sm:w-100 overflow-y-auto p-0 flex flex-col border-l border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <SheetTitle className="text-base font-semibold">Filters</SheetTitle>
          {/* Default Shadcn Sheet close button is handled internally, but we can rely on it or hide it. 
              The user's screenshot has an X top right. Shadcn puts it there automatically. */}
        </div>

        <div className="flex-1 p-4 space-y-6">
          {/* Save Filter Button */}
          <Button className="w-full justify-center">Save Filter</Button>

          {/* Status Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Status</Label>
              <button
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={handleClear}
              >
                Clear All
              </button>
            </div>
            <div className="space-y-2">
              {[
                "Active Customer",
                "Prospect",
                "Lead",
                "Inactive Customer",
                "Archive",
              ].map((statusLabel) => {
                const isChecked =
                  (statusLabel === "Active Customer" &&
                    draft.statuses.includes("Active")) ||
                  (statusLabel === "Inactive Customer" &&
                    draft.statuses.includes("Inactive"));

                return (
                  <div
                    key={statusLabel}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`status-${statusLabel}`}
                      checked={isChecked}
                      onCheckedChange={() => toggleStatus(statusLabel)}
                    />
                    <label
                      htmlFor={`status-${statusLabel}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {statusLabel}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Company Section */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Company</Label>
            <div className="flex flex-wrap gap-2 p-2 border border-input rounded-md bg-transparent min-h-10 items-center focus-within:ring-1 focus-within:ring-ring">
              {draft.companies.map((company) => (
                <Badge
                  key={company}
                  variant="secondary"
                  className="bg-secondary/50 font-normal flex items-center gap-1"
                >
                  {company}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeCompany(company)}
                  />
                </Badge>
              ))}
              <Input
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                onKeyDown={handleCompanyKeyDown}
                placeholder="Add..."
                className="border-0 p-0 h-auto min-w-20 flex-1 focus-visible:ring-0 shadow-none bg-transparent"
              />
            </div>
          </div>

          {/* Date Range Section */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              Date Range (Last Contact)
            </Label>
            <div className="flex gap-2">
              <div className="space-y-1.5 flex-1">
                <span className="text-xs text-muted-foreground">From</span>
                <div className="relative">
                  <Input
                    type="date"
                    value={draft.dateFrom}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        dateFrom: e.target.value,
                      }))
                    }
                    className="bg-transparent"
                  />
                </div>
              </div>
              <div className="space-y-1.5 flex-1">
                <span className="text-xs text-muted-foreground">To</span>
                <div className="relative">
                  <Input
                    type="date"
                    value={draft.dateTo}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, dateTo: e.target.value }))
                    }
                    className="bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Phone Number</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={draft.phone}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="(555) 123-4567"
                className="pl-9 bg-transparent"
              />
            </div>
          </div>

          {/* Email Contains */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Email Contains</Label>
            <div className="relative">
              <AtSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={draft.email}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="e.g., @gmail.com"
                className="pl-9 bg-transparent"
              />
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="pt-2">
            <Button className="w-full" onClick={handleApply}>
              Apply Filters
            </Button>
          </div>

          {/* Saved Filters */}
          <div className="space-y-1 pt-4 border-t border-border mt-4">
            <Label className="text-sm font-semibold mb-2 block">
              Saved Filters
            </Label>
            <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50 text-sm cursor-pointer">
              <span>Active Customers</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted text-sm cursor-pointer text-muted-foreground hover:text-foreground">
              <span>Recent Contacts</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted text-sm cursor-pointer text-muted-foreground hover:text-foreground">
              <span>Inactive Leads</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted text-sm cursor-pointer text-muted-foreground hover:text-foreground">
              <span>High-value prospects</span>
              <Star className="h-4 w-4 fill-muted-foreground text-muted-foreground" />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
