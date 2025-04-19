"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Package,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Home,
  Laptop,
  Smartphone,
  Headphones,
  Watch,
  LogOut,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function Navbar() {
  const pathname = usePathname();
  const logOut = useAuthStore((state) => state.logout);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const rol = useAuthStore((state) => state.profile.rol);
  const handleLogout = () => {
    logOut();
  };
  const isActive = (path: string) => {
    return pathname === path;
  };

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
                  <DropdownMenuItem asChild>
                    <Link
                      to="/productos?category=laptops"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Laptop className="h-4 w-4" />
                      <span>Laptops</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/productos?category=smartphones"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Smartphone className="h-4 w-4" />
                      <span>Smartphones</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/productos?category=audio"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Headphones className="h-4 w-4" />
                      <span>Audio</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/productos?category=wearables"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Watch className="h-4 w-4" />
                      <span>Wearables</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>

            <Link to="/cart">
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
                  <span className="sr-only">Account</span>
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
                    to="/perfil/pedidos"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Package className="h-4 w-4" />
                    <span>Pedidos</span>
                  </Link>
                </DropdownMenuItem>

                {rol === 2 && (
                  <DropdownMenuItem asChild>
                    <Link
                      to="/admin"
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
                    <SheetClose asChild>
                      <Link
                        to="/productos?category=laptops"
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <Laptop className="h-5 w-5" />
                        Laptops
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/productos?category=smartphones"
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <Smartphone className="h-5 w-5" />
                        Smartphones
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/productos?category=audio"
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <Headphones className="h-5 w-5" />
                        Audio
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/productos?category=wearables"
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <Watch className="h-5 w-5" />
                        Wearables
                      </Link>
                    </SheetClose>
                  </nav>
                  <div className="p-4 border-t border-slate-700">
                    <SheetClose asChild>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <User className="h-5 w-5" />
                        My Account
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <SheetContent
          side="top"
          className="w-full h-auto bg-slate-800 border-slate-700 text-slate-200"
        >
          <div className="container mx-auto py-4 px-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search for productos..."
                className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-700"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-400 mb-2">
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <Link to="/productos?q=macbook">MacBook Pro</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <Link to="/productos?q=iphone">iPhone</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <Link to="/productos?q=airpods">AirPods</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <Link to="/productos?q=samsung">Samsung</Link>
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
