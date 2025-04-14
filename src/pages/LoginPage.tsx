"use client"

import type React from "react"

import { useState } from "react"
import { loginRequest } from "@/api/auth"
import { useAuthStore } from "@/store/auth"
import type { UserLogin, Profile } from "@/types/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from "lucide-react"
import {  useNavigate } from "react-router-dom";
export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const setToken = useAuthStore((state) => state.setToken)
  const navigate = useNavigate();


  //FORMULARIO CON REACT-HOOK-FORM
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const username = (e.currentTarget.elements[0] as HTMLInputElement).value
      const password = (e.currentTarget.elements[1] as HTMLInputElement).value

      const user: UserLogin = {
        username,
        password,
      }

      const resLogin = await loginRequest(user)

      //GUARDAR EL TOKEN ACCESS EN EL LOCAL STORAGE
      setToken(resLogin.data.access)
      console.log(resLogin.data)


      const profile : Profile = {
        username: resLogin.data.username,
        email: resLogin.data.email,
        first_name: resLogin.data.first_name,
        last_name: resLogin.data.last_name,
      }

      //GUARDAR LOS DATOS DEL USUARIO EN EL STORE DE ZUSTAND
      useAuthStore.setState({ profile })
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex w-full h-screen min-h-[calc(100vh-150px)] items-center justify-center p-4 bg-gray-950">
      <div className="w-full max-w-md">
        <Card className="border-gray-800 bg-gray-900 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center text-white">Bienvenido</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Ingrese sus datos para acceder a su cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-300">
                  Usuario
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Nombre"
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-gray-700"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Contraseña
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <LockIcon className="h-4 w-4" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-gray-700"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-600"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-400">
                    Recordar contraseña
                  </Label>
                </div>
                
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesion" : "Inciar sesion"}
              </Button>
            </form>
          </CardContent>
          
        </Card>
      </div>
    </div>
  )
}
