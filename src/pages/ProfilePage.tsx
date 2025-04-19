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
import { UserCircle, Mail, MapPin } from "lucide-react";
import { useAuthStore } from "@/store/auth.ts";

const profileFormSchema = z.object({
  nombre: z.string().min(2, "Name must be at least 2 characters."),
  apellidos: z.string().min(10, "Phone number must be at least 10 digits"),
  correo: z.string().email("Invalid email Direccion"),
});

const addressFormSchema = z.object({
  Direccion: z.string().min(5, "Direccion is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(3, "Postal code is required"),
});

export function ProfilePage() {
  //   const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const profile = useAuthStore((state) => state.profile);

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
      Direccion: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
    },
  });

  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsSubmitting(true);

    // Simulate API call
    /*    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
      setIsSubmitting(false)
    }, 1000) */
  }

  function onAddressSubmit(values: z.infer<typeof addressFormSchema>) {
    setIsSubmitting(true);

    // Simulate API call
    /*  setTimeout(() => {
      toast({
        title: "Direccion updated",
        description: "Your Direccion information has been updated successfully.",
      })
      setIsSubmitting(false)
    }, 1000) */
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
                        {isSubmitting ? "Saving..." : "Save Changes"}
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
                      <FormField
                        control={addressForm.control}
                        name="Direccion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200">
                              Direccion
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                                  <MapPin className="h-4 w-4" />
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

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={addressForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200">
                                City
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
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200">
                                State
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
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200">
                                Postal Code
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
                        {isSubmitting ? "Saving..." : "Save Direccion"}
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
