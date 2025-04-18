"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AtSignIcon, MailIcon, UserIcon } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { useNavigate } from "react-router-dom"

export function DashboardPage() {
  const profile = useAuthStore((state) => state.profile)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const handleLogout = () => {
    logout() 
    navigate("/login") 
  }

  if (!profile) {
    return (
      <div className="flex min-h-[calc(100vh-150px)] items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-500 text-center">No se pudo cargar informacion del perfil.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-150px)] items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border-gray-200">
        <CardHeader className="pb-2">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24 border-2 border-purple-100">
              <AvatarFallback className="bg-purple-600 text-white text-xl">
                {getInitials(profile.nombre, profile.apellidos)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center space-y-1">
              <CardTitle className="text-2xl font-bold">
                {profile.nombre} {profile.apellidos}
              </CardTitle>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                Perfil de usuario
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 bg-purple-100 p-2 rounded-full">
                <AtSignIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Usuario</p>
                <p className="font-medium">{profile.nombre}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 bg-purple-100 p-2 rounded-full">
                <MailIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Correo</p>
                <p className="font-medium">{profile.correo}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 bg-purple-100 p-2 rounded-full">
                <UserIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium">
                  {profile.nombre} {profile.apellidos}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <div
          onClick={handleLogout}
          className="flex items-center justify-center p-4 bg-gray-50 rounded-b-lg hover:bg-gray-100 cursor-pointer"
        >
          <p className="text-sm">Cerrar sesión</p>
        </div>
      </Card>
    </div>
  )
}
