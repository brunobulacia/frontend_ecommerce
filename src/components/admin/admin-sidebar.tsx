"use client";

import { Link } from "react-router-dom";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";

export function AdminSidebar() {
  const pathname = usePathname();
  const logOut = useAuthStore((state) => state.logout);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = () => {
    logOut();
  };

  const navItems = [
    {
      title: "Dashboard",
      to: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Productos",
      to: "/admin/productos",
      icon: Package,
    },
    {
      title: "Pedidos",
      to: "/admin/pedidos",
      icon: ShoppingCart,
    },
    {
      title: "Usuarios",
      to: "/admin/usuarios",
      icon: Users,
    },
    {
      title: "Categorias",
      to: "/admin/categorias",
      icon: Tag,
    },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-slate-800 border-r border-slate-700 h-screen sticky top-0">
      <div className="p-4 border-b border-slate-700">
        <Link
          to="/admin"
          className="flex items-center gap-2 font-bold text-white"
        >
          <Package className="h-6 w-6" />
          <span>ElectroTech Admin</span>
        </Link>
      </div>
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Button
            key={item.to}
            variant={isActive(item.to) ? "default" : "ghost"}
            className={`w-full justify-start ${
              isActive(item.to)
                ? "bg-slate-600 hover:bg-slate-500 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
            asChild
          >
            <Link to={item.to}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700"
          asChild
        >
          <Link to="/inicio">
            <ChevronRight className="mr-2 h-4 w-4" />
            Ir a la Tienda
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700 mt-1"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <Link
            to="/login"
            className="w-full flex items-start"
            onClick={handleLogout}
          >
            Cerrar Sesion
          </Link>
        </Button>
      </div>
    </div>
  );
}
