import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminRecentOrders } from "@/components/admin/admin-recent-orders";
import { AdminRevenueChart } from "@/components/admin/admin-revenue-chart";
import { AdminTopProducts } from "@/components/admin/admin-top-products";
import { Users, Package, DollarSign, ShoppingCart } from "lucide-react";

export function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="text-sm text-slate-400">
          Last updated: {new Date().toLocaleDateString()}{" "}
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminMetricCard
          title="Total Revenue"
          value="$24,389.50"
          change="+12.5%"
          trend="up"
          icon={<DollarSign className="h-5 w-5" />}
          description="Total revenue this month"
        />
        <AdminMetricCard
          title="Orders"
          value="356"
          change="+8.2%"
          trend="up"
          icon={<ShoppingCart className="h-5 w-5" />}
          description="Total orders this month"
        />
        <AdminMetricCard
          title="Products"
          value="124"
          change="+4.6%"
          trend="up"
          icon={<Package className="h-5 w-5" />}
          description="Active products"
        />
        <AdminMetricCard
          title="Customers"
          value="1,893"
          change="-2.3%"
          trend="down"
          icon={<Users className="h-5 w-5" />}
          description="Registered customers"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-slate-700 bg-slate-800 shadow-xl lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Revenue Overview</CardTitle>
                <CardDescription className="text-slate-400">
                  Monthly revenue for the current year
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-slate-500"></div>
                  <span className="text-slate-400">Last Year</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-slate-400"></div>
                  <span className="text-slate-400">This Year</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AdminRevenueChart />
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Top Products</CardTitle>
            <CardDescription className="text-slate-400">
              Best selling products this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminTopProducts />
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-700 bg-slate-800 shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent Orders</CardTitle>
              <CardDescription className="text-slate-400">
                Latest customer orders
              </CardDescription>
            </div>
            <a
              href="/admin/orders"
              className="text-sm text-slate-400 hover:text-white"
            >
              View All
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <AdminRecentOrders />
        </CardContent>
      </Card>
    </div>
  );
}

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
