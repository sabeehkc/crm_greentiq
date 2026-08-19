"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCustomers,
  reorderCustomers,
  deleteCustomer,
  Customer,
  CustomerStatus,
  bulkDeleteCustomers,
  bulkUpdateCustomerStatus,
} from "@/lib/api";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CustomerRow } from "./CustomerRow";
import { FiltersPanel } from "./FiltersPanel";
import { CustomerFormModal } from "./CustomerFormModal";
import { CustomerDetailsModal } from "./CustomerDetailsModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { useDebounce } from "@/hooks/useDebounce";
import { exportCustomersToCSV } from "@/lib/export";

type SortColumn = "name" | "email" | "lastContactDate" | null;
type SortDirection = "asc" | "desc";

export interface AdvancedFilters {
  statuses: string[];
  companies: string[];
  dateFrom: string;
  dateTo: string;
  phone: string;
  email: string;
}

const defaultAdvancedFilters: AdvancedFilters = {
  statuses: [],
  companies: [],
  dateFrom: "",
  dateTo: "",
  phone: "",
  email: "",
};

export default function CustomerList() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "All">(
    "All",
  );
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(
    defaultAdvancedFilters,
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsFiltersOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const {
    data: customers,
    isLoading,
    isError,
  } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const reorderMutation = useMutation({
    mutationFn: reorderCustomers,
    onSuccess: (newData) => {
      queryClient.setQueryData(["customers"], newData);
    },
    onError: () => {
      toast.error("Failed to reorder customers");
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && customers) {
      const oldIndex = customers.findIndex((c: Customer) => c.id === active.id);
      const newIndex = customers.findIndex((c: Customer) => c.id === over.id);

      const newOrderedData: Customer[] = arrayMove<Customer>(
        customers,
        oldIndex,
        newIndex,
      );

      // Optimistic update
      queryClient.setQueryData(["customers"], newOrderedData);

      // Send to server
      const orderedIds = newOrderedData.map((c: Customer) => c.id);
      reorderMutation.mutate(orderedIds);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleView = (customer: Customer) => {
    setViewingCustomer(customer);
    setIsDetailsOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      deleteMutationList.mutate(customerToDelete.id);
    }
  };

  const deleteMutationList = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      toast.success("Customer deleted");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: () => {
      toast.error("Failed to delete customer");
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeleteCustomers,
    onSuccess: () => {
      toast.success("Selected customers deleted");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setSelectedIds([]);
    },
    onError: () => toast.error("Failed to delete customers"),
  });

  const bulkUpdateStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: CustomerStatus }) =>
      bulkUpdateCustomerStatus(ids, status),
    onSuccess: () => {
      toast.success("Status updated for selected customers");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setSelectedIds([]);
    },
    onError: () => toast.error("Failed to update status"),
  });

  // Filter logic
  const filteredCustomers =
    customers?.filter((c: Customer) => {
      // Basic Status Filter
      if (statusFilter !== "All" && c.status !== statusFilter) {
        return false;
      }

      // Basic Search Term
      if (debouncedSearchTerm) {
        const term = debouncedSearchTerm.toLowerCase();
        if (
          !c.name.toLowerCase().includes(term) &&
          !c.email.toLowerCase().includes(term) &&
          !c.company.toLowerCase().includes(term)
        ) {
          return false;
        }
      }

      // Advanced Filters
      if (advancedFilters.statuses.length > 0) {
        if (!advancedFilters.statuses.includes(c.status)) return false;
      }

      if (advancedFilters.companies.length > 0) {
        if (
          !advancedFilters.companies.some((company) =>
            c.company.toLowerCase().includes(company.toLowerCase()),
          )
        )
          return false;
      }

      if (advancedFilters.dateFrom) {
        if (new Date(c.lastContactDate) < new Date(advancedFilters.dateFrom))
          return false;
      }

      if (advancedFilters.dateTo) {
        if (new Date(c.lastContactDate) > new Date(advancedFilters.dateTo))
          return false;
      }

      if (advancedFilters.phone) {
        if (
          !c.phone.toLowerCase().includes(advancedFilters.phone.toLowerCase())
        )
          return false;
      }

      if (advancedFilters.email) {
        if (
          !c.email.toLowerCase().includes(advancedFilters.email.toLowerCase())
        )
          return false;
      }

      return true;
    }) || [];

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") setSortDirection("desc");
      else setSortColumn(null);
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column)
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  let sortedCustomers = [...filteredCustomers];
  if (sortColumn) {
    sortedCustomers.sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      if (sortColumn === "lastContactDate") {
        const timeA = new Date(aVal as string).getTime();
        const timeB = new Date(bVal as string).getTime();
        if (timeA < timeB) return sortDirection === "asc" ? -1 : 1;
        if (timeA > timeB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      } else {
        const strA = String(aVal).toLowerCase();
        const strB = String(bVal).toLowerCase();
        if (strA < strB) return sortDirection === "asc" ? -1 : 1;
        if (strA > strB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      }
    });
  }

  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-muted/50 border rounded-lg animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium px-2">
            {selectedIds.length} customer(s) selected
          </span>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                bulkUpdateStatusMutation.mutate({
                  ids: selectedIds,
                  status: "Active",
                })
              }
            >
              Mark Active
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                bulkUpdateStatusMutation.mutate({
                  ids: selectedIds,
                  status: "Inactive",
                })
              }
            >
              Mark Inactive
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => bulkDeleteMutation.mutate(selectedIds)}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Select
            value={statusFilter}
            onValueChange={(value: CustomerStatus | "All") => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-32.5">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setIsFiltersOpen(true)}
            className="px-2 sm:px-4 shrink-0"
          >
            <Filter className="h-4 w-4 sm:mr-2" />{" "}
            <span className="hidden sm:inline">Filters</span>
            <kbd className="hidden lg:inline-flex ml-2 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          <Button
            variant="outline"
            onClick={() => exportCustomersToCSV(sortedCustomers)}
            className="px-2 sm:px-4 shrink-0"
          >
            <Download className="h-4 w-4 sm:mr-2" />{" "}
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button onClick={handleAddNew} className="px-2 sm:px-4 shrink-0">
            <Plus className="h-4 w-4 sm:mr-2" />{" "}
            <span className="hidden sm:inline">Add Customer</span>
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12.5 p-2">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={
                        sortedCustomers.length > 0 &&
                        selectedIds.length === sortedCustomers.length
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedIds(sortedCustomers.map((c) => c.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      aria-label="Select all"
                    />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Name {renderSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center">
                    Email {renderSortIcon("email")}
                  </div>
                </TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort("lastContactDate")}
                >
                  <div className="flex items-center">
                    Last Contact {renderSortIcon("lastContactDate")}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-destructive h-32"
                  >
                    Failed to load customers.
                  </TableCell>
                </TableRow>
              ) : !paginatedCustomers.length ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center h-32 text-muted-foreground"
                  >
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                <SortableContext
                  items={paginatedCustomers.map((c: Customer) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {paginatedCustomers.map((customer: Customer) => (
                    <CustomerRow
                      key={customer.id}
                      customer={customer}
                      onEdit={handleEdit}
                      onView={handleView}
                      onDelete={() => handleDelete(customer)}
                      isSelected={selectedIds.includes(customer.id)}
                      onToggleSelection={(id, selected) => {
                        setSelectedIds((prev) =>
                          selected
                            ? [...prev, id]
                            : prev.filter((selectedId) => selectedId !== id),
                        );
                      }}
                    />
                  ))}
                </SortableContext>
              )}
            </TableBody>
          </Table>
        </div>
      </DndContext>

      {/* Pagination Footer */}
      {!isLoading && !isError && filteredCustomers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-2 pt-2 gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of{" "}
            {filteredCustomers.length} entries
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${itemsPerPage}`}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-17.5">
                  <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 25, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-25 items-center justify-center text-sm font-medium">
              Page {currentPage} of {totalPages || 1}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage >= totalPages || totalPages === 0}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <FiltersPanel
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        initialFilters={advancedFilters}
        onApply={(filters) => {
          setAdvancedFilters(filters);
          setCurrentPage(1);
          setIsFiltersOpen(false);
        }}
      />

      <CustomerFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        customer={editingCustomer}
      />

      <CustomerDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        customer={viewingCustomer}
        onEdit={handleEdit}
        onDelete={(id) => {
          // Find the customer by ID to pass to handleDelete
          const cust = customers?.find((c: Customer) => c.id === id);
          if (cust) handleDelete(cust);
        }}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={customerToDelete?.name}
      />
    </div>
  );
}
