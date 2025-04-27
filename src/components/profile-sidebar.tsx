"use client";

import { Link } from "react-router-dom";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Package, CreditCard, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth";

export function ProfileSidebar() {
  const pathname = usePathname();

  const logOut = useAuthStore((state) => state.logout);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = () => {
    logOut();
  };

  const links = [
    {
      to: "/perfil",
      label: "Informacion Personal",
      icon: User,
    },
    {
      to: "/pedidos",
      label: "Pedidos",
      icon: Package,
    },
    {
      to: "/profile/payment",
      label: "Metodos de pago",
      icon: CreditCard,
    },
  ];

  return (
    <Card className="border-slate-700 bg-slate-800 shadow-xl">
      <div className="p-4 space-y-1">
        {links.map((link) => (
          <Button
            key={link.to}
            variant={isActive(link.to) ? "default" : "ghost"}
            className={`w-full justify-start ${
              isActive(link.to)
                ? "bg-slate-600 hover:bg-slate-500 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
            asChild
          >
            <Link to={link.to}>
              <link.icon className="mr-2 h-4 w-4" />
              {link.label}
            </Link>
          </Button>
        ))}

        <Button
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <Link to="/" onClick={handleLogout}>
            Cerrar Sesion
          </Link>
        </Button>
      </div>
    </Card>
  );
}
