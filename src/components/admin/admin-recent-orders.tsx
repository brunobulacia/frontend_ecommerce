import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

// Mock data for recent orders
const recentOrders = [
  {
    id: "ORD-1234",
    customer: "John Doe",
    email: "john@example.com",
    date: "2025-04-15T14:30:00",
    status: "Delivered",
    total: 1299.99,
  },
  {
    id: "ORD-5678",
    customer: "Sarah Miller",
    email: "sarah@example.com",
    date: "2025-04-02T09:15:00",
    status: "Shipped",
    total: 1099.98,
  },
  {
    id: "ORD-3456",
    customer: "Emily Wilson",
    email: "emily@example.com",
    date: "2025-04-14T11:20:00",
    status: "Processing",
    total: 799.99,
  },
  {
    id: "ORD-7890",
    customer: "David Brown",
    email: "david@example.com",
    date: "2025-04-10T13:50:00",
    status: "Shipped",
    total: 349.99,
  },
  {
    id: "ORD-6789",
    customer: "Robert Martinez",
    email: "robert@example.com",
    date: "2025-04-05T15:10:00",
    status: "Cancelled",
    total: 899.99,
  },
];

export function AdminRecentOrders() {
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
    <div className="-mx-6">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-slate-700">
            <TableHead className="text-slate-400 font-medium">
              Order ID
            </TableHead>
            <TableHead className="text-slate-400 font-medium">
              Customer
            </TableHead>
            <TableHead className="text-slate-400 font-medium">Date</TableHead>
            <TableHead className="text-slate-400 font-medium">Status</TableHead>
            <TableHead className="text-slate-400 font-medium text-right">
              Total
            </TableHead>
            <TableHead className="text-slate-400 font-medium text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.map((order) => (
            <TableRow
              key={order.id}
              className="hover:bg-slate-800/50 border-slate-700"
            >
              <TableCell className="font-medium text-white">
                {order.id}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-white">{order.customer}</div>
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
              <TableCell className="text-slate-300 text-right">
                ${order.total.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
