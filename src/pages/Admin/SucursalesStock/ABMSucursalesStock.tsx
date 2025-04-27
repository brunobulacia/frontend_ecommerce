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
  Filter,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createSucursal,
  deleteSucursal,
  getSucursales,
  updateSucursal,
} from "@/api/sucursales";

import { Sucursal } from "@/types/sucursal";

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

const columnHelper = createColumnHelper<Sucursal>();

export default function ABMSucursalesStock() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtering, setFiltering] = useState("");
  const [showDialogCrear, setShowDialogCrear] = useState(false);
  const [showDialogEditar, setShowDialogEditar] = useState(false);
  const [showDialogBorrar, setShowDialogBorrar] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(
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
    columnHelper.accessor("sucursal", {
      header: "Sucursal",
      cell: (info) => (
        <span className="font-medium text-white">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("producto", {
      header: "Producto",
      cell: (info) => <span className="text-slate-300">{info.getValue()}</span>,
    }),
    columnHelper.accessor("departamento", {
      header: "Departamento",
      cell: (info) => <span className="text-slate-300">{info.getValue()}</span>,
    }),
    columnHelper.accessor("stock", {
      header: "Stock",
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
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-8 px-2 text-xs bg-red-600 text-white hover:bg-red-600"
            onClick={() => handleEliminar(row.original)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: sucursales,
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

  const handleEditar = (sucursal: Sucursal) => {
    setSelectedSucursal(sucursal);
    setShowDialogEditar(true);
  };

  const handleEliminar = (sucursal: Sucursal) => {
    setSelectedSucursal(sucursal);
    setShowDialogBorrar(true);
  };

  const crearSucursal = () => {
    setShowDialogCrear(true);
  };

  useEffect(() => {
    async function fetchSucursales() {
      try {
        const res = await getSucursales();
        setSucursales(res.data);
      } catch (error) {
        setError("No se pudo obtener la información de las sucursales.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSucursales();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <Card className="max-w-5xl mx-auto border-slate-700 shadow-md rounded-xl overflow-hidden bg-[#1e2745]">
        <CardHeader className="bg-[#1e2745] border-b border-slate-700 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-white">
              Gestión de Stock de Sucursales
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={crearSucursal}
                className="bg-slate-600 hover:bg-slate-500 text-white"
              >
                <Filter className="h-4 w-4 mr-2" />
                Crear Reporte
              </Button>
              <Button
                onClick={crearSucursal}
                className="bg-slate-600 hover:bg-slate-500 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Stock de Sucursal
              </Button>
            </div>
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
              placeholder="Buscar sucursales..."
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
                          No se encontraron sucursales
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-slate-400">
                  Mostrando {table.getRowModel().rows.length} de{" "}
                  {sucursales.length} sucursales
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

      {/* Crear Sucursal */}
      {showDialogCrear && (
        <DialogCrearSucursal onClose={() => setShowDialogCrear(false)} />
      )}

      {/* Editar Sucursal */}
      {showDialogEditar && selectedSucursal && (
        <EditSucursalDialog
          sucursal={selectedSucursal}
          onClose={() => setShowDialogEditar(false)}
        />
      )}

      {/* Borrar Sucursal */}
      {showDialogBorrar && selectedSucursal && (
        <DialogBorrarSucursal
          sucursal={selectedSucursal}
          onClose={() => setShowDialogBorrar(false)}
        />
      )}
    </div>
  );
}

// DIALOG CREAR SUCURSAL
interface DialogCrearProps {
  onClose: () => void;
}

export function DialogCrearSucursal({ onClose }: DialogCrearProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Sucursal>();

  const onSubmit: SubmitHandler<Sucursal> = async (data) => {
    try {
      await createSucursal(data);
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
            Nueva Stock de Sucursal
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Complete el formulario para crear un nuevo stock de sucursal
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="sucursal"
              className="text-sm font-medium text-slate-300"
            >
              Sucursal
            </Label>
            <Input
              id="sucursal"
              placeholder="Ingrese el nombre de la sucursal"
              {...register("sucursal", {
                required: "El nombre de la sucursal es obligatorio",
              })}
              className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${
                errors.sucursal ? "border-red-500" : ""
              }`}
            />
            {errors.sucursal && (
              <p className="text-red-400 text-xs mt-1">
                {errors.sucursal.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="producto"
              className="text-sm font-medium text-slate-300"
            >
              Producto
            </Label>
            <Input
              id="producto"
              placeholder="Ingrese el producto de la sucursal"
              {...register("producto", {
                required: "La dirección es obligatoria",
              })}
              className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${
                errors.producto ? "border-red-500" : ""
              }`}
            />
            {errors.producto && (
              <p className="text-red-400 text-xs mt-1">
                {errors.producto.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="stock"
              className="text-sm font-medium text-slate-300"
            >
              Stock
            </Label>
            <Input
              id="stock"
              placeholder="Ingrese el stock del producto"
              {...register("stock", {
                required: "El teléfono es obligatorio",
              })}
              className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${
                errors.stock ? "border-red-500" : ""
              }`}
            />
            {errors.stock && (
              <p className="text-red-400 text-xs mt-1">
                {errors.stock.message}
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
              {isSubmitting ? "Guardando..." : "Guardar Sucursal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// DIALOG EDITAR SUCURSAL
interface DialogEditProps {
  sucursal: Partial<Sucursal>;
  onClose: () => void;
}

interface FormData {
  sucursal: string;
  producto: string;
  stock: number;
}

export function EditSucursalDialog({ sucursal, onClose }: DialogEditProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      sucursal: sucursal.sucursal,
      producto: sucursal.producto,
      stock: sucursal.stock,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await updateSucursal(sucursal.id!, data);
      reset();
      window.location.reload();
      // console.log(updatedSucursal);
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
            Editar Sucursal
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Modifique los datos de la sucursal{" "}
            <span className="font-medium text-white">{sucursal.sucursal}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="sucursal"
              className="text-sm font-medium text-slate-300"
            >
              Sucursal
            </Label>
            <Input
              id="sucursal"
              {...register("sucursal", {
                required: "El sucursal es obligatorio",
              })}
              className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${
                errors.sucursal ? "border-red-500" : ""
              }`}
            />
            {errors.sucursal && (
              <p className="text-red-400 text-xs mt-1">
                {errors.sucursal.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="producto"
              className="text-sm font-medium text-slate-300"
            >
              Producto
            </Label>
            <Input
              id="producto"
              {...register("producto", {
                required: "La dirección es obligatoria",
              })}
              className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${
                errors.producto ? "border-red-500" : ""
              }`}
            />
            {errors.producto && (
              <p className="text-red-400 text-xs mt-1">
                {errors.producto.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="stock"
              className="text-sm font-medium text-slate-300"
            >
              Stock
            </Label>
            <Input
              id="stock"
              {...register("stock", {
                required: "El teléfono es obligatorio",
              })}
              className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${
                errors.stock ? "border-red-500" : ""
              }`}
            />
            {errors.stock && (
              <p className="text-red-400 text-xs mt-1">
                {errors.stock.message}
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

// DIALOG BORRAR SUCURSAL
interface confirmar {
  confirmacion: string;
}

interface DialogBorrarProps {
  sucursal: Sucursal;
  onClose: () => void;
}

export function DialogBorrarSucursal({ sucursal, onClose }: DialogBorrarProps) {
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
      await deleteSucursal(sucursal.id);
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
            Eliminar Sucursal
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Esta acción no se puede deshacer. Se eliminará permanentemente la
            sucursal{" "}
            <span className="font-medium text-white">{sucursal.sucursal}</span>.
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
              dependan de esta sucursal.
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
              {isSubmitting ? "Eliminando..." : "Eliminar Sucursal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
