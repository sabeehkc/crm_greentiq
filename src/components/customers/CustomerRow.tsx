"use client";

import React from "react";
import { Customer } from "@/lib/api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GripVertical, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface CustomerRowProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onView: (customer: Customer) => void;
  onDelete: () => void;
  isSelected: boolean;
  onToggleSelection: (id: string, selected: boolean) => void;
}

export function CustomerRow({
  customer,
  onEdit,
  onView,
  onDelete,
  isSelected,
  onToggleSelection,
}: CustomerRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: customer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "bg-muted/50" : ""} cursor-pointer hover:bg-muted/50`}
      onClick={() => onView(customer)}
    >
      <TableCell className="w-12.5 p-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:bg-muted p-1 rounded text-muted-foreground flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) =>
                onToggleSelection(customer.id, !!checked)
              }
              aria-label="Select customer"
            />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
              {getInitials(customer.name)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{customer.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{customer.email}</TableCell>
      <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
      <TableCell>{customer.company}</TableCell>
      <TableCell>
        <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
          {customer.status}
        </Badge>
      </TableCell>
      <TableCell>
        {new Date(customer.lastContactDate).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(customer.email);
              }}
            >
              Copy email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit(customer);
              }}
            >
              <Edit className="h-4 w-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
