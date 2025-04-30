"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  User,
  LogOut,
  Package,
  ShoppingCart,
  Users,
  Tag,
  ChevronRight,
  ChartNoAxesCombined,
  MapPinHouse,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { updateCarrito } from "@/api/carrito";

export function AdminHeader() {
  const logOut = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logOut();
    updateCarrito();
  };
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-700 bg-slate-800 px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 bg-slate-800 border-slate-700 text-slate-200 p-0"
        >
          <div className="p-4 border-b border-slate-700">
            <Link
              to="/admin/productos"
              className="flex items-center gap-2 font-bold text-white"
            >
              <Package className="h-6 w-6" />
              <span>ElectroTech Admin</span>
            </Link>
          </div>
          <div className="flex flex-col gap-1 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700"
              asChild
            >
              <Link to="/admin/productos">
                <Package className="mr-2 h-4 w-4" />
                Productos
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700"
              asChild
            >
              <Link to="/admin/pedidos">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Pedidos
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700"
              asChild
            >
              <Link to="/admin/usuarios">
                <Users className="mr-2 h-4 w-4" />
                Usuarios
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700"
              asChild
            >
              <Link to="/admin/categorias">
                <Tag className="mr-2 h-4 w-4" />
                Categorias
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700"
              asChild
            >
              <Link to="/admin/stock">
                <ChartNoAxesCombined className="mr-2 h-4 w-4" />
                Stocks
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700"
              asChild
            >
              <Link to="/admin/sucursales">
                <MapPinHouse className="mr-2 h-4 w-4" />
                Sucursales
              </Link>
            </Button>
          </div>
          <div className="mt-auto p-4 border-t border-slate-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700"
              asChild
            >
              <Link to="/home">
                <ChevronRight className="mr-2 h-4 w-4" />
                Ir a la tienda
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
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex items-center justify-end gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-slate-800 border-slate-700 text-slate-200"
          >
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
              <Link
                to="/perfil"
                className="flex items-center gap-2 cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
              <Link
                to="/pedidos"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Package className="mr-2 h-4 w-4" />
                <span>Pedidos</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <Link to="/" onClick={handleLogout}>
                Cerrar Sesion
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
