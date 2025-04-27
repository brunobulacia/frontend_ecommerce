"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type Usuarios,
  createUsuario,
  deleteUsuario,
  getUsuarios,
  updateUsuario,
} from "@/api/user";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const columnHelper = createColumnHelper<Usuarios>();

export default function ABMUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtering, setFiltering] = useState("");
  const [showDialogCrear, setShowDialogCrear] = useState(false);
  const [showDialogEditar, setShowDialogEditar] = useState(false);
  const [showDialogBorrar, setShowDialogBorrar] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuarios | null>(null);

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => (
        <Badge
          variant="outline"
          className="font-mono bg-slate-700 border-slate-600 text-slate-300"
        >
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("nombre", {
      header: "Nombre",
      cell: (info) => (
        <span className="font-medium text-white">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("apellidos", {
      header: "Apellidos",
      cell: (info) => <span className="text-white">{info.getValue()}</span>,
    }),
    columnHelper.accessor("rol", {
      header: "Rol",
      cell: (info) => {
        const roleText = info.getValue();
        return (
          <Badge
            className={
              roleText === "Administrador"
                ? "bg-purple-800 hover:bg-purple-700 text-white"
                : roleText === "Delivery"
                ? "bg-blue-800 hover:bg-blue-700 text-white"
                : "bg-green-800 hover:bg-green-700 text-white"
            }
          >
            {roleText}
          </Badge>
        );
      },
    }),
    columnHelper.accessor("correo", {
      header: "Correo",
      cell: (info) => <span className="text-slate-300">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: "Acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2 text-xs border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
            onClick={() => handleEditar(row.original)}
          >
            <Edit className="h-3.5 w-3.5 mr-1" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-8 px-2 text-xs"
            onClick={() => handleEliminar(row.original)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Borrar
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: usuarios,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filtering,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const handleEditar = (usuario: Usuarios) => {
    setSelectedUsuario(usuario);
    setShowDialogEditar(true);
  };

  const handleEliminar = (usuario: Usuarios) => {
    setSelectedUsuario(usuario);
    setShowDialogBorrar(true);
  };

  const crearUsuario = () => {
    setShowDialogCrear(true);
  };

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const res = await getUsuarios();
        setUsuarios(res.data);
      } catch (error) {
        setError("No se pudo obtener la información de los usuarios.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsuarios();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <Card className="max-w-5xl mx-auto border-slate-700 shadow-md rounded-xl overflow-hidden bg-[#1e2745]">
        <CardHeader className="bg-[#1e2745] border-b border-slate-700 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-white">
              Gestión de Usuarios
            </CardTitle>
            <Button
              onClick={crearUsuario}
              className="bg-slate-600 hover:bg-slate-500 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-[#1e2745]">
          {error && (
            <Alert
              variant="destructive"
              className="mb-6 bg-red-900/20 border-red-800 text-red-200"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
              placeholder="Buscar usuarios..."
              value={filtering}
              onChange={(e) => setFiltering(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full bg-slate-700" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px] bg-slate-700" />
                    <Skeleton className="h-4 w-[200px] bg-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="rounded-md border border-slate-700 overflow-hidden">
                <table className="w-full">
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr
                        key={headerGroup.id}
                        className="border-b border-slate-700 bg-slate-800"
                      >
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-4 py-3 text-left text-sm font-medium text-slate-300"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.length > 0 ? (
                      table.getRowModel().rows.map((row, i) => (
                        <tr
                          key={row.id}
                          className={`border-b border-slate-700 transition-colors hover:bg-[#232d4d] ${
                            i % 2 === 0 ? "bg-[#1e2745]" : "bg-[#1a2035]"
                          }`}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-4 py-3 text-sm">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="h-24 text-center text-slate-400"
                        >
                          No se encontraron usuarios
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-slate-400">
                  Mostrando {table.getRowModel().rows.length} de{" "}
                  {usuarios.length} usuarios
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Anterior</span>
                  </Button>
                  <div className="text-sm font-medium text-slate-300">
                    Página {table.getState().pagination.pageIndex + 1} de{" "}
                    {table.getPageCount()}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Siguiente</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Crear Usuario */}
      {showDialogCrear && (
        <DialogCrearUsuario onClose={() => setShowDialogCrear(false)} />
      )}

      {/* Editar Usuario */}
      {showDialogEditar && selectedUsuario && (
        <EditUsuarioDialog
          usuario={selectedUsuario}
          onClose={() => setShowDialogEditar(false)}
        />
      )}

      {/* Borrar Usuario */}
      {showDialogBorrar && selectedUsuario && (
        <DialogBorrarUsuario
          usuario={selectedUsuario}
          onClose={() => setShowDialogBorrar(false)}
        />
      )}
    </div>
  );
}

interface DialogCrearProps {
  onClose: () => void;
}

export function DialogCrearUsuario({ onClose }: DialogCrearProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Usuarios>();

  // Para manejar el select con react-hook-form
  const watchRol = watch("rol");

  const onSubmit: SubmitHandler<Usuarios> = async (data) => {
    try {
      await createUsuario(data);
      reset();
      window.location.reload(); // Recarga la página para actualizar la lista
      onClose();
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#1e2745] border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Crear Usuario
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Complete los campos para registrar un nuevo usuario.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="nombre" className="text-slate-300 mb-2">
              Nombre
            </Label>
            <Input
              id="nombre"
              {...register("nombre", { required: "El nombre es obligatorio" })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
            />
            {errors.nombre && (
              <p className="text-red-400 text-sm">{errors.nombre.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="apellidos" className="text-slate-300 mb-2">
              Apellidos
            </Label>
            <Input
              id="apellidos"
              {...register("apellidos", {
                required: "Los apellidos son obligatorios",
              })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
            />
            {errors.apellidos && (
              <p className="text-red-400 text-sm">{errors.apellidos.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="rol" className="text-slate-300">
              Rol
            </Label>
            <Select
              onValueChange={(value) => setValue("rol", value)}
              defaultValue={watchRol}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:ring-slate-500">
                <SelectValue placeholder="Seleccione un rol" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                <SelectItem value="Administrador">Administrador</SelectItem>
                <SelectItem value="Delivery">Delivery</SelectItem>
                <SelectItem value="Cliente">Cliente</SelectItem>
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register("rol", { required: "El rol es obligatorio" })}
            />
            {errors.rol && (
              <p className="text-red-400 text-sm">{errors.rol.message}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-slate-600 hover:bg-slate-500 text-white mt-2"
          >
            {isSubmitting ? "Creando..." : "Crear Usuario"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DialogEditProps {
  usuario: Usuarios;
  onClose: () => void;
}

export function EditUsuarioDialog({ usuario, onClose }: DialogEditProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<Usuarios>({
    defaultValues: {
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      rol: usuario.rol,
      correo: usuario.correo,
    },
  });

  // Para manejar el select con react-hook-form
  const watchRol = watch("rol");

  const onSubmit: SubmitHandler<Usuarios> = async (data) => {
    try {
      await updateUsuario(usuario.id, data);
      reset();
      window.location.reload(); // Recarga la página para actualizar la lista
      onClose();
    } catch (error) {
      console.error("Error al editar usuario:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#1e2745] border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Editar Usuario
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Modifique los campos necesarios para actualizar el usuario.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="nombre" className="text-slate-300">
              Nombre
            </Label>
            <Input
              id="nombre"
              {...register("nombre", { required: "El nombre es obligatorio" })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
            />
            {errors.nombre && (
              <p className="text-red-400 text-sm">{errors.nombre.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="apellidos" className="text-slate-300">
              Apellidos
            </Label>
            <Input
              id="apellidos"
              {...register("apellidos", {
                required: "Los apellidos son obligatorios",
              })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
            />
            {errors.apellidos && (
              <p className="text-red-400 text-sm">{errors.apellidos.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="rol" className="text-slate-300">
              Rol
            </Label>
            <Select
              onValueChange={(value) => setValue("rol", value)}
              defaultValue={watchRol}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:ring-slate-500">
                <SelectValue placeholder="Seleccione un rol" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                <SelectItem value="Administrador">Administrador</SelectItem>
                <SelectItem value="Delivery">Delivery</SelectItem>
                <SelectItem value="Cliente">Cliente</SelectItem>
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register("rol", { required: "El rol es obligatorio" })}
            />
            {errors.rol && (
              <p className="text-red-400 text-sm">{errors.rol.message}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-slate-600 hover:bg-slate-500 text-white mt-2"
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DialogBorrarProps {
  usuario: Usuarios;
  onClose: () => void;
}

export function DialogBorrarUsuario({ usuario, onClose }: DialogBorrarProps) {
  const handleDelete = async () => {
    try {
      await deleteUsuario(usuario.id);
      window.location.reload(); // Recarga la página para actualizar la lista
      onClose();
    } catch (error) {
      console.error("Error al borrar usuario:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#1e2745] border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-red-400">
            Borrar Usuario
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            ¿Está seguro de que desea borrar al usuario{" "}
            <span className="font-bold text-white">{usuario.nombre}</span>? Esta
            acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-4 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-700 hover:bg-red-600 text-white"
          >
            Borrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
