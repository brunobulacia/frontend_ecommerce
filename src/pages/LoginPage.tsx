"use client";

import type React from "react";
import { useState } from "react";
import { loginRequest } from "@/api/auth";
import { useAuthStore } from "@/store/auth";
import type { UserLogin, UserProfile } from "@/types/user";
import { Direccion } from "@/types/direccion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, LockIcon, Package, UserIcon } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { getDireccionId } from "@/api/direccion";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const correo = (e.currentTarget.elements[0] as HTMLInputElement).value;
      const password = (e.currentTarget.elements[1] as HTMLInputElement).value;
      const user: UserLogin = {
        correo,
        password,
      };

      const resLogin = await loginRequest(user);

      let directions: Direccion = {
        id: 0,
        departamento: 0,
        pais: "",
        ciudad: "",
        zona: "",
        calle: "",
        numero: "",
        referencia: "",
      };

      if (resLogin.data.user.direccion != null) {
        const resDir = await getDireccionId(resLogin.data.user.direccion);

        if (resDir.data.id > 0) {
          directions = {
            id: resDir.data.id || "",
            departamento: 0,
            pais: resDir.data.pais || "",
            ciudad: resDir.data.ciudad || "",
            zona: resDir.data.zona || "",
            calle: resDir.data.calle || "",
            numero: resDir.data.numero || "",
            referencia: resDir.data.referencia || "",
          };
        }
      } else {
        directions = {
          id: 0,
          departamento: 0,
          pais: "",
          ciudad: "",
          zona: "",
          calle: "",
          numero: "",
          referencia: "",
        };
      }
      console.log(resLogin.data);
      setToken(resLogin.data.token);

      const profile: UserProfile = {
        nombre: resLogin.data.user.nombre,
        correo: resLogin.data.user.correo,
        apellidos: resLogin.data.user.apellidos,
        rol: resLogin.data.user.rol,
        id: resLogin.data.user.id,
        direccion: resLogin.data.user.direccion,
      };

      useAuthStore.setState({ directions });
      useAuthStore.setState({ profile });

      navigate("/inicio");
    } catch (error) {
      /* setError(
        (error as any)?.response?.data?.message ||
          "An unexpected error occurred"
      ); */
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex w-full h-screen min-h-[calc(100vh-150px)] items-center justify-center p-4 bg-slate-900">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800 shadow-xl">
          <CardHeader className="space-y-1">
            {/* Logo de ElectroTech */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <Package className="h-6 w-6 text-white" />
              <span className="font-bold text-xl text-white">ElectroTech</span>
            </div>
            <CardTitle className="text-3xl font-bold text-center text-white">
              Bienvenido
            </CardTitle>
            <CardDescription className="text-slate-300 text-center">
              Ingrese sus datos para acceder a su cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="correo"
                  className="text-sm font-medium text-slate-200"
                >
                  Usuario
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <Input
                    id="correo"
                    type="text"
                    placeholder="Correo"
                    className="pl-10 bg-slate-200 border-slate-600 text-zinc-800 placeholder:text-slate-500 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-200"
                >
                  Contraseña
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                    <LockIcon className="h-4 w-4" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-slate-200 border-slate-600 text-zinc-800 placeholder:text-slate-500 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"}
                    </span>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-600 hover:bg-slate-500 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
              <div className="text-center text-sm text-slate-300">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/registro"
                  className="text-white hover:text-slate-200 font-medium"
                >
                  <span className="font-semibold">Crear cuenta</span>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
