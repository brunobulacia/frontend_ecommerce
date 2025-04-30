"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Package,
  ShoppingCart,
  User,
  Menu,
  X,
  Home,
  Laptop,
  LogOut,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { getCategories } from "@/api/categories";
import { Categorie } from "@/types/categories";
import { updateCarrito, cerrarCarrito } from "@/api/carrito";

export default function Navbar() {
  const pathname = usePathname();
  const logOut = useAuthStore((state) => state.logout);
  const rol = useAuthStore((state) => state.profile.rol);
  const { profile } = useAuthStore.getState();
  const { id_cart } = useAuthStore.getState();

  const handleLogout = async () => {
    logOut();

    const data: cerrarCarrito = {
      carrito: id_cart,
      estado: "confirmado",
      usuario: profile.id,
    };

    const res = await updateCarrito(data);
    console.log(res);
  };
  const isActive = (path: string) => {
    return pathname === path;
  };

  const [categories, setCategories] = useState<Categorie[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch (error) {
        console.error("Error al traer las categorias:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
            <Link
              to="/inicio"
              className="flex items-center gap-2 font-bold text-white"
            >
              <Package className="h-6 w-6" />
              <span className="hidden md:inline-block">ElectroTech</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/inicio"
                className={`text-sm font-medium transition-colors ${
                  isActive("/inicio")
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Inicio
              </Link>
              <Link
                to="/productos"
                className={`text-sm font-medium transition-colors ${
                  isActive("/productos")
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Productos
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-sm font-medium text-slate-400 hover:text-white hover:bg-transparent"
                  >
                    Categorias
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-slate-200">
                  {categories.map((category) => (
                    <DropdownMenuItem asChild key={category.id}>
                      <a
                        href={`/productos_cat?categoria_id=${category.id}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span>{category.nombre}</span>
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/carrito">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Carrito</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <User className="h-20 w-20" />
                  <span className="sr-only">Cuenta</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-slate-800 border-slate-700 text-slate-200"
              >
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem asChild>
                  <Link
                    to="/perfil"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/pedidos"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Package className="h-4 w-4" />
                    <span>Mis Pedidos</span>
                  </Link>
                </DropdownMenuItem>

                {rol === 1 && (
                  <DropdownMenuItem asChild>
                    <Link
                      to="/admin/productos"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <UserCog className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  <Link to="/" onClick={handleLogout}>
                    Cerrar Sesion
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 bg-slate-800 border-slate-700 text-slate-200 p-0"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <Link
                      to="/inicio"
                      className="flex items-center gap-2 font-bold text-white"
                    >
                      <Package className="h-6 w-6" />
                      <span>ElectroTech</span>
                    </Link>
                    <SheetClose className="rounded-sm opacity-70 ring-offset-slate-800 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Cerrar</span>
                    </SheetClose>
                  </div>
                  <nav className="flex-1 p-4 space-y-2">
                    <SheetClose asChild>
                      <Link
                        to="/inicio"
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive("/inicio")
                            ? "bg-slate-700 text-white"
                            : "text-slate-400 hover:text-white hover:bg-slate-700"
                        }`}
                      >
                        <Home className="h-5 w-5" />
                        Inicio
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/productos"
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive("/productos")
                            ? "bg-slate-700 text-white"
                            : "text-slate-400 hover:text-white hover:bg-slate-700"
                        }`}
                      >
                        <Laptop className="h-5 w-5" />
                        Productos
                      </Link>
                    </SheetClose>
                    <div className="pt-2 pb-1">
                      <h3 className="px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Categorias
                      </h3>
                    </div>
                    {categories.map((category) => (
                      <SheetClose asChild key={category.id}>
                        <Link
                          to={`/productos_cat?categoria_id=${category.id}`}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <span>{category.nombre}</span>
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="p-4 border-t border-slate-700">
                    <SheetClose asChild>
                      <Link
                        to="/perfil"
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <User className="h-5 w-5" />
                        Mi cuenta
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
