"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  Package,
  UserIcon,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { registerRequest } from "@/api/auth.ts";
import { createUser, UserProfile } from "@/types/user.ts";
import { useAuthStore } from "@/store/auth.ts";

// Esquema de validación con zod
const registerSchema = z.object({
  nombre: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  apellidos: z
    .string()
    .min(2, { message: "Los apellidos deben tener al menos 2 caracteres" }),
  correo: z.string().email({ message: "Ingrese un correo electrónico válido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .regex(/[A-Z]/, {
      message: "La contraseña debe contener al menos una letra mayúscula",
    })
    .regex(/[0-9]/, {
      message: "La contraseña debe contener al menos un número",
    }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setProfile = useAuthStore((state) => state.setProfile);
  const setToken = useAuthStore((state) => state.setToken);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: "",
      apellidos: "",
      correo: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      console.log("Datos del formulario:", data);

      const user: createUser = {
        nombre: data.nombre,
        apellidos: data.apellidos,
        correo: data.correo,
        password: data.password,
      };

      const response = await registerRequest(user);
      console.log("Respuesta del servidor:", response.data);

      setProfile({
        nombre: response.data.usuario.nombre,
        correo: response.data.usuario.correo,
        apellidos: response.data.usuario.apellidos,
        rol: response.data.usuario.rol,
      } as UserProfile);
      setToken(response.data.token);

      navigate("/inicio");
    } catch (error) {
      console.error("Error al registrar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center p-4 bg-slate-900">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800 shadow-xl">
          <CardHeader className="space-y-1">
            {/* Logo de ElectroTech */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <Package className="h-6 w-6 text-white" />
              <span className="font-bold text-xl text-white">ElectroTech</span>
            </div>
            <CardTitle className="text-3xl font-bold text-center text-white">
              Crear cuenta
            </CardTitle>
            <CardDescription className="text-slate-300 text-center">
              Ingrese sus datos para registrarse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Campo Nombre */}
              <div className="space-y-2">
                <Label
                  htmlFor="nombre"
                  className="text-sm font-medium text-slate-200"
                >
                  Nombre
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Ingrese su nombre"
                    className="pl-10 bg-slate-200 border-slate-600 text-zinc-800 placeholder:text-slate-500 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                    {...register("nombre")}
                  />
                </div>
                {errors.nombre && (
                  <p className="text-sm text-red-400 mt-1">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              {/* Campo Apellidos */}
              <div className="space-y-2">
                <Label
                  htmlFor="apellidos"
                  className="text-sm font-medium text-slate-200"
                >
                  Apellidos
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <Input
                    id="apellidos"
                    type="text"
                    placeholder="Ingrese sus apellidos"
                    className="pl-10 bg-slate-200 border-slate-600 text-zinc-800 placeholder:text-slate-500 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                    {...register("apellidos")}
                  />
                </div>
                {errors.apellidos && (
                  <p className="text-sm text-red-400 mt-1">
                    {errors.apellidos.message}
                  </p>
                )}
              </div>

              {/* Campo Correo */}
              <div className="space-y-2">
                <Label
                  htmlFor="correo"
                  className="text-sm font-medium text-slate-200"
                >
                  Correo electrónico
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                    <MailIcon className="h-4 w-4" />
                  </div>
                  <Input
                    id="correo"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    className="pl-10 bg-slate-200 border-slate-600 text-zinc-800 placeholder:text-slate-500 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                    {...register("correo")}
                  />
                </div>
                {errors.correo && (
                  <p className="text-sm text-red-400 mt-1">
                    {errors.correo.message}
                  </p>
                )}
              </div>

              {/* Campo Contraseña */}
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
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700"
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
                {errors.password && (
                  <p className="text-sm text-red-400 mt-1">
                    {errors.password.message}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  La contraseña debe tener al menos 8 caracteres, una letra
                  mayúscula y un número.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-slate-600 hover:bg-slate-500 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Registrando..." : "Registrarse"}
                </Button>
              </div>

              <div className="text-center text-sm text-slate-300">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/login"
                  className="text-white hover:text-slate-200 font-medium"
                >
                  <span className="font-semibold">Iniciar sesión</span>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
