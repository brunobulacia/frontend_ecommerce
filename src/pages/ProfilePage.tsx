"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useToast } from "@/components/ui/use-toast"
import { ProfileSidebar } from "@/components/profile-sidebar.tsx";
import { UserCircle, Mail } from "lucide-react";
import { useAuthStore } from "@/store/auth.ts";
import { updateUsuario, Usuarios } from "@/api/user";
import { updateDireccionRequest } from "@/api/direccion";
import { UpdateDireccionRequest } from "@/types/direccion";
import { updateUser } from "@/types/user";

const profileFormSchema = z.object({
  nombre: z.string().min(2, "El nombre deberia ser de al menos 2 caracteres."),
  apellidos: z.string().min(5, "Apellido minimo 5 caracteres."),
  correo: z.string().email("El correo no es valido."),
});

const addressFormSchema = z.object({
  pais: z.string().min(2, "Pais is required"),
  departamento: z.string().min(2, "Departamento is required"),
  ciudad: z.string().min(2, "Ciudad is required"),
  zona: z.string().min(2, "Zona is required"),
  calle: z.string().min(2, "Calle is required"),
  numero: z.string().min(1, "Numero is required"),
  referencia: z.string().optional(),
});

export function ProfilePage() {
  //   const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const profile = useAuthStore((state) => state.profile);
  const direccion = useAuthStore((state) => state.directions);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      nombre: profile?.nombre,
      apellidos: profile?.apellidos,
      correo: profile?.correo,
    },
  });

  const addressForm = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      pais: direccion.pais,
      departamento: direccion.departamento.nombre,
      ciudad: direccion.ciudad,
      zona: direccion.zona,
      calle: direccion.calle,
      numero: direccion.numero,
      referencia: direccion.referencia,
    },
  });

  const onProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    setIsSubmitting(true);

    try {
      /* const updatedUser : Usuarios = {
        nombre: values.nombre || profile.nombre,
        apellidos: values.apellidos || profile.apellidos,
        correo: values.correo || profile.correo,
        id : 
      }; */

      // console.log(updatedUser);
      // const res = await updateUsuario(updatedUser);
      // console.log(res.data);
      // useAuthStore.setState({ profile: res.data });
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setIsSubmitting(false);
    }
  };

  async function onAddressSubmit(values: z.infer<typeof addressFormSchema>) {
    setIsSubmitting(true);

    try {
      const updatedAddress: UpdateDireccionRequest = {
        id_direccion: direccion.id,
        pais: values.pais || direccion.pais,
        departamento: values.departamento || direccion.departamento.nombre,
        ciudad: values.ciudad || direccion.ciudad,
        zona: values.zona || direccion.zona,
        calle: values.calle || direccion.calle,
        numero: values.numero || direccion.numero,
        referencia: values.referencia || direccion.referencia,
      };

      console.log(updatedAddress);
      const res = await updateDireccionRequest(updatedAddress);
      console.log(res.data);
      setIsSubmitting(false);
      useAuthStore.setState({ directions: res.data });
    } catch (error) {
      console.error("Error updating address:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8 font-">Mi Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <ProfileSidebar />
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="bg-slate-800 border-slate-700">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-slate-700 text-slate-200"
              >
                Perfil
              </TabsTrigger>
              <TabsTrigger
                value="Direccion"
                className="data-[state=active]:bg-slate-700 text-slate-200"
              >
                Direccion
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card className="border-slate-700 bg-slate-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white text-2xl ">
                    Informacion Personal
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Actualice sus datos personales.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={profileForm.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200">
                              Nombre
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                                  <UserCircle className="h-4 w-4" />
                                </div>
                                <Input
                                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="apellidos"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200">
                              Apellidos
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                                  <UserCircle className="h-4 w-4" />
                                </div>
                                <Input
                                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="correo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200">
                              Correo
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                                  <Mail className="h-4 w-4" />
                                </div>
                                <Input
                                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="bg-slate-600 hover:bg-slate-500 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="Direccion" className="mt-6">
              <Card className="border-slate-700 bg-slate-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    Informacion de la direccion.
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Actualice sus detalles de envio.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...addressForm}>
                    <form
                      onSubmit={addressForm.handleSubmit(onAddressSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={addressForm.control}
                          name="pais"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200">
                                Pais
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={addressForm.control}
                          name="departamento"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200">
                                Departamento
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={addressForm.control}
                          name="ciudad"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200">
                                Ciudad
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={addressForm.control}
                          name="zona"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200">
                                Zona
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={addressForm.control}
                          name="calle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200">
                                Calle
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={addressForm.control}
                          name="numero"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200">
                                Numero
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={addressForm.control}
                          name="referencia"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200">
                                Referencia
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="bg-slate-600 hover:bg-slate-500 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Guardando..." : "Guardar Direccion"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
