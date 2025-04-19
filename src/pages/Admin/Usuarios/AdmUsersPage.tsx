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
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Lock,
} from "lucide-react";

// Mock data for users
const users = [
  {
    id: "USR-1234",
    name: "John Doe",
    email: "john@example.com",
    role: "Customer",
    status: "Active",
    lastLogin: "2025-04-15T14:30:00",
    orders: 5,
  },
  {
    id: "USR-5678",
    name: "Sarah Miller",
    email: "sarah@example.com",
    role: "Customer",
    status: "Active",
    lastLogin: "2025-04-12T09:15:00",
    orders: 3,
  },
  {
    id: "USR-9012",
    name: "Michael Johnson",
    email: "michael@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2025-04-14T16:45:00",
    orders: 0,
  },
  {
    id: "USR-3456",
    name: "Emily Wilson",
    email: "emily@example.com",
    role: "Customer",
    status: "Inactive",
    lastLogin: "2025-03-20T11:20:00",
    orders: 2,
  },
  {
    id: "USR-7890",
    name: "David Brown",
    email: "david@example.com",
    role: "Customer",
    status: "Active",
    lastLogin: "2025-04-10T13:50:00",
    orders: 7,
  },
  {
    id: "USR-2345",
    name: "Jessica Taylor",
    email: "jessica@example.com",
    role: "Customer",
    status: "Active",
    lastLogin: "2025-04-08T10:30:00",
    orders: 4,
  },
  {
    id: "USR-6789",
    name: "Robert Martinez",
    email: "robert@example.com",
    role: "Customer",
    status: "Blocked",
    lastLogin: "2025-03-15T15:10:00",
    orders: 1,
  },
  {
    id: "USR-0123",
    name: "Jennifer Garcia",
    email: "jennifer@example.com",
    role: "Manager",
    status: "Active",
    lastLogin: "2025-04-13T09:45:00",
    orders: 0,
  },
  {
    id: "USR-4567",
    name: "Christopher Lee",
    email: "chris@example.com",
    role: "Customer",
    status: "Active",
    lastLogin: "2025-04-11T14:20:00",
    orders: 2,
  },
  {
    id: "USR-8901",
    name: "Amanda White",
    email: "amanda@example.com",
    role: "Customer",
    status: "Active",
    lastLogin: "2025-04-09T16:30:00",
    orders: 3,
  },
];

export function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <Button className="bg-slate-600 hover:bg-slate-500 text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search users..."
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
              <TableHead className="text-slate-300">User</TableHead>
              <TableHead className="text-slate-300">Role</TableHead>
              <TableHead className="text-slate-300">Status</TableHead>
              <TableHead className="text-slate-300">Last Login</TableHead>
              <TableHead className="text-slate-300">Orders</TableHead>
              <TableHead className="text-slate-300 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-slate-800/50 border-slate-700"
              >
                <TableCell>
                  <div>
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-sm text-slate-400">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      user.role === "Admin"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : user.role === "Manager"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-slate-600 hover:bg-slate-700"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      user.status === "Active"
                        ? "bg-green-600 hover:bg-green-700"
                        : user.status === "Inactive"
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "bg-red-600 hover:bg-red-700"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-300">
                  {formatDate(user.lastLogin)}
                </TableCell>
                <TableCell className="text-slate-300">{user.orders}</TableCell>
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
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
                        <Lock className="mr-2 h-4 w-4" />
                        <span>Reset Password</span>
                      </DropdownMenuItem>
                      {user.status !== "Blocked" ? (
                        <DropdownMenuItem className="text-amber-500 hover:bg-slate-700 hover:text-amber-500 cursor-pointer">
                          <Lock className="mr-2 h-4 w-4" />
                          <span>Block User</span>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-green-500 hover:bg-slate-700 hover:text-green-500 cursor-pointer">
                          <Lock className="mr-2 h-4 w-4" />
                          <span>Unblock User</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-500 hover:bg-slate-700 hover:text-red-500 cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
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
          Showing {indexOfFirstUser + 1} to{" "}
          {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
          {filteredUsers.length} users
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
