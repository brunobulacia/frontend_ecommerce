"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MoreVertical,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  XCircle,
} from "lucide-react";

// Mock data for orders
const orders = [
  {
    id: "ORD-1234",
    customer: "John Doe",
    email: "john@example.com",
    date: "2025-04-15T14:30:00",
    status: "Delivered",
    total: 1299.99,
    items: 1,
  },
  {
    id: "ORD-5678",
    customer: "Sarah Miller",
    email: "sarah@example.com",
    date: "2025-04-02T09:15:00",
    status: "Shipped",
    total: 1099.98,
    items: 2,
  },
  {
    id: "ORD-9012",
    customer: "Michael Johnson",
    email: "michael@example.com",
    date: "2025-03-20T16:45:00",
    status: "Delivered",
    total: 1599.99,
    items: 3,
  },
  {
    id: "ORD-3456",
    customer: "Emily Wilson",
    email: "emily@example.com",
    date: "2025-04-14T11:20:00",
    status: "Processing",
    total: 799.99,
    items: 1,
  },
  {
    id: "ORD-7890",
    customer: "David Brown",
    email: "david@example.com",
    date: "2025-04-10T13:50:00",
    status: "Shipped",
    total: 349.99,
    items: 1,
  },
  {
    id: "ORD-2345",
    customer: "Jessica Taylor",
    email: "jessica@example.com",
    date: "2025-04-08T10:30:00",
    status: "Delivered",
    total: 2499.99,
    items: 2,
  },
  {
    id: "ORD-6789",
    customer: "Robert Martinez",
    email: "robert@example.com",
    date: "2025-04-05T15:10:00",
    status: "Cancelled",
    total: 899.99,
    items: 1,
  },
  {
    id: "ORD-0123",
    customer: "Jennifer Garcia",
    email: "jennifer@example.com",
    date: "2025-04-01T09:45:00",
    status: "Delivered",
    total: 1299.99,
    items: 2,
  },
  {
    id: "ORD-4567",
    customer: "Christopher Lee",
    email: "chris@example.com",
    date: "2025-03-28T14:20:00",
    status: "Shipped",
    total: 599.99,
    items: 1,
  },
  {
    id: "ORD-8901",
    customer: "Amanda White",
    email: "amanda@example.com",
    date: "2025-03-25T16:30:00",
    status: "Delivered",
    total: 449.99,
    items: 1,
  },
];

export function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Orders</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search orders..."
            className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Sort
          </Button>
          <Button
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            Filter
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-slate-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-800">
            <TableRow className="hover:bg-slate-800/50 border-slate-700">
              <TableHead className="text-slate-300">Order ID</TableHead>
              <TableHead className="text-slate-300">Customer</TableHead>
              <TableHead className="text-slate-300">Date</TableHead>
              <TableHead className="text-slate-300">Status</TableHead>
              <TableHead className="text-slate-300">Items</TableHead>
              <TableHead className="text-slate-300">Total</TableHead>
              <TableHead className="text-slate-300 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow
                key={order.id}
                className="hover:bg-slate-800/50 border-slate-700"
              >
                <TableCell className="text-slate-300 font-medium">
                  {order.id}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-white">
                      {order.customer}
                    </div>
                    <div className="text-sm text-slate-400">{order.email}</div>
                  </div>
                </TableCell>
                <TableCell className="text-slate-300">
                  {formatDate(order.date)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      order.status === "Delivered"
                        ? "bg-green-600 hover:bg-green-700"
                        : order.status === "Shipped"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : order.status === "Processing"
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "bg-red-600 hover:bg-red-700"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-300">{order.items}</TableCell>
                <TableCell className="text-slate-300 font-medium">
                  ${order.total.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-40 bg-slate-800 border-slate-700 text-slate-200"
                    >
                      <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Invoice</span>
                      </DropdownMenuItem>
                      {order.status !== "Cancelled" && (
                        <DropdownMenuItem className="text-red-500 hover:bg-slate-700 hover:text-red-500 cursor-pointer">
                          <XCircle className="mr-2 h-4 w-4" />
                          <span>Cancel</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-400">
          Showing {indexOfFirstOrder + 1} to{" "}
          {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
          {filteredOrders.length} orders
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <div className="text-sm text-slate-400">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
