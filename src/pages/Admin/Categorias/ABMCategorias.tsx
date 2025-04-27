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
  type Category,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/categories";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const columnHelper = createColumnHelper<Category>();

export default function ABMCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtering, setFiltering] = useState("");
  const [showDialogCrear, setShowDialogCrear] = useState(false);
  const [showDialogEditar, setShowDialogEditar] = useState(false);
  const [showDialogBorrar, setShowDialogBorrar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

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
    columnHelper.accessor("descripcion", {
      header: "Descripción",
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
    data: categories,
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

  const handleEditar = (category: Category) => {
    setSelectedCategory(category);
    setShowDialogEditar(true);
  };

  const handleEliminar = (category: Category) => {
    setSelectedCategory(category);
    setShowDialogBorrar(true);
  };

  const crearCategoria = () => {
    setShowDialogCrear(true);
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch (error) {
        setError("No se pudo obtener la información de las categorías.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <Card className="max-w-5xl mx-auto border-slate-700 shadow-md rounded-xl overflow-hidden bg-[#1e2745]">
        <CardHeader className="bg-[#1e2745] border-b border-slate-700 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-white">
              Gestión de Categorías
            </CardTitle>
            <Button
              onClick={crearCategoria}
              className="bg-slate-600 hover:bg-slate-500 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
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
              placeholder="Buscar categorías..."
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
                          No se encontraron categorías
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-slate-400">
                  Mostrando {table.getRowModel().rows.length} de{" "}
                  {categories.length} categorías
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

      {/* Crear Categoria */}
      {showDialogCrear && (
        <DialogCrearCat onClose={() => setShowDialogCrear(false)} />
      )}

      {/* Editar Categoria */}
      {showDialogEditar && selectedCategory && (
        <EditCategoryDialog
          category={selectedCategory}
          onClose={() => setShowDialogEditar(false)}
        />
      )}

      {/* Borrar Categoria */}
      {showDialogBorrar && selectedCategory && (
        <DialogBorrarCat
          category={selectedCategory}
          onClose={() => setShowDialogBorrar(false)}
        />
      )}
    </div>
  );
}

// DIALOG CREAR CATEGORIA
interface DialogCrearProps {
  onClose: () => void;
}

export function DialogCrearCat({ onClose }: DialogCrearProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Category>();

  const onSubmit: SubmitHandler<Category> = async (data) => {
    try {
      await createCategory(data);
      reset();
      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#1e2745] border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Nueva Categoría
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Complete el formulario para crear una nueva categoría
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="nombre"
              className="text-sm font-medium text-slate-300"
            >
              Nombre
            </Label>
            <Input
              id="nombre"
              placeholder="Ingrese el nombre de la categoría"
              {...register("nombre", {
                required: "El nombre de la categoría es obligatorio",
              })}
              className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${
                errors.nombre ? "border-red-500" : ""
              }`}
            />
            {errors.nombre && (
              <p className="text-red-400 text-xs mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="descripcion"
              className="text-sm font-medium text-slate-300"
            >
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              placeholder="Ingrese la descripción de la categoría"
              {...register("descripcion", {
                required: "La descripción es obligatoria",
              })}
              className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${
                errors.descripcion ? "border-red-500" : ""
              }`}
              rows={3}
            />
            {errors.descripcion && (
              <p className="text-red-400 text-xs mt-1">
                {errors.descripcion.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-slate-600 hover:bg-slate-500 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar Categoría"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// DIALOG EDITAR CATEGORIA
interface DialogEditProps {
  category: Category;
  onClose: () => void;
}

interface FormData {
  nombre: string;
  descripcion: string;
}

export function EditCategoryDialog({ category, onClose }: DialogEditProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      nombre: category.nombre,
      descripcion: category.descripcion,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const updatedCategory: Category = {
        id: category.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
      };

      await updateCategory(updatedCategory);
      reset();
      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#1e2745] border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Editar Categoría
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Modifique los datos de la categoría{" "}
            <span className="font-medium text-white">{category.nombre}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="nombre"
              className="text-sm font-medium text-slate-300"
            >
              Nombre
            </Label>
            <Input
              id="nombre"
              {...register("nombre", {
                required: "El nombre es obligatorio",
              })}
              className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${
                errors.nombre ? "border-red-500" : ""
              }`}
            />
            {errors.nombre && (
              <p className="text-red-400 text-xs mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="descripcion"
              className="text-sm font-medium text-slate-300"
            >
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              {...register("descripcion", {
                required: "La descripción es obligatoria",
              })}
              className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${
                errors.descripcion ? "border-red-500" : ""
              }`}
              rows={3}
            />
            {errors.descripcion && (
              <p className="text-red-400 text-xs mt-1">
                {errors.descripcion.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-slate-600 hover:bg-slate-500 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// DIALOG BORRAR CATEGORIA
interface confirmar {
  confirmacion: string;
}

interface DialogBorrarProps {
  category: Category;
  onClose: () => void;
}

export function DialogBorrarCat({ category, onClose }: DialogBorrarProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<confirmar>();

  const onSubmit: SubmitHandler<confirmar> = async (data) => {
    if (data.confirmacion !== "Eliminar") {
      alert("La confirmación no es correcta");
      return;
    }
    try {
      await deleteCategory(category.id);
      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#1e2745] border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-red-400">
            Eliminar Categoría
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Esta acción no se puede deshacer. Se eliminará permanentemente la
            categoría{" "}
            <span className="font-medium text-white">{category.nombre}</span>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <Alert
            variant="destructive"
            className="border-red-800 bg-red-900/20 text-red-200"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Advertencia</AlertTitle>
            <AlertDescription>
              Esta acción puede afectar a otros elementos del sistema que
              dependan de esta categoría.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label
              htmlFor="confirmacion"
              className="text-sm font-medium text-slate-300"
            >
              Escriba "Eliminar" para confirmar
            </Label>
            <Input
              id="confirmacion"
              {...register("confirmacion", {
                required: "La confirmación es obligatoria",
                validate: (value) =>
                  value === "Eliminar" ||
                  "Debe escribir 'Eliminar' exactamente",
              })}
              className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${
                errors.confirmacion ? "border-red-500" : ""
              }`}
              placeholder="Eliminar"
            />
            {errors.confirmacion && (
              <p className="text-red-400 text-xs mt-1">
                {errors.confirmacion.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting}
              className="bg-red-700 hover:bg-red-600 text-white"
            >
              {isSubmitting ? "Eliminando..." : "Eliminar Categoría"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
