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
  createPedido,
  deletePedido,
  getPedidos,
  updatePedido,
} from "@/api/pedidos";
import { Pedidos } from "@/types/pedidos";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BarChart3, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { getReportePedidos, getReportePedidosExcel } from "@/api/reportes";
import { FiltrosReportesPedidos } from "@/types/reportes";

const columnHelper = createColumnHelper<Pedidos>();

export default function ABMPedidos() {
  const [pedidos, setPedidos] = useState<Pedidos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtering, setFiltering] = useState("");
  const [showDialogCrear, setShowDialogCrear] = useState(false);
  const [showDialogEditar, setShowDialogEditar] = useState(false);
  const [showDialogBorrar, setShowDialogBorrar] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedidos | null>(null);
  const [showDialogReporte, setShowDialogReporte] = useState(false);

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
    columnHelper.accessor("fecha", {
      header: "Fecha",
      cell: (info) => (
        <span className="font-medium text-white">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("total", {
      header: "Total",
      cell: (info) => <span className="text-white">${info.getValue()}</span>,
    }),
    columnHelper.accessor("estado", {
      header: "Estado",
      cell: (info) => (
        <Badge
          className={
            info.getValue() === "pendiente"
              ? "bg-yellow-600 hover:bg-yellow-500 text-white"
              : info.getValue() === "entregado"
              ? "bg-green-600 hover:bg-green-500 text-white"
              : info.getValue() === "enviado"
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : "bg-red-600 hover:bg-red-500 text-white"
          }
        >
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("nombre", {
      header: "Nombre",
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
    data: pedidos,
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

  const handleEditar = (pedido: Pedidos) => {
    setSelectedPedido(pedido);
    setShowDialogEditar(true);
  };

  const handleEliminar = (pedido: Pedidos) => {
    setSelectedPedido(pedido);
    setShowDialogBorrar(true);
  };

  const crearPedido = () => {
    setShowDialogCrear(true);
  };

  const generarReporte = () => {
    setShowDialogReporte(true);
  };

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const res = await getPedidos();
        setPedidos(res.data);
      } catch (error) {
        setError("No se pudo obtener la información de los pedidos.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPedidos();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <Card className="max-w-5xl mx-auto border-slate-700 shadow-md rounded-xl overflow-hidden bg-[#1e2745]">
        <CardHeader className="bg-[#1e2745] border-b border-slate-700 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-white">
              Gestión de Pedidos
            </CardTitle>
            <div className="flex items-center justify-end gap-5">
              <Button
                onClick={generarReporte}
                className="bg-slate-600 hover:bg-slate-500 text-white"
              >
                <Filter className="h-4 w-4 mr-2" />
                Generar Reporte
              </Button>
              <Button
                onClick={crearPedido}
                className="bg-slate-600 hover:bg-slate-500 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Pedido
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
              placeholder="Buscar pedidos..."
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
                          No se encontraron pedidos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-slate-400">
                  Mostrando {table.getRowModel().rows.length} de{" "}
                  {pedidos.length} pedidos
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

      {showDialogReporte && (
        <DialogReportePedido onClose={() => setShowDialogReporte(false)} />
      )}

      {/* Crear Pedido */}
      {showDialogCrear && (
        <DialogCrearPedido onClose={() => setShowDialogCrear(false)} />
      )}

      {/* Editar Pedido */}
      {showDialogEditar && selectedPedido && (
        <EditPedidoDialog
          pedido={selectedPedido}
          onClose={() => setShowDialogEditar(false)}
        />
      )}

      {/* Borrar Pedido */}
      {showDialogBorrar && selectedPedido && (
        <DialogBorrarPedido
          pedido={selectedPedido}
          onClose={() => setShowDialogBorrar(false)}
        />
      )}
    </div>
  );
}

interface ReportePedidoProps {
  onClose: () => void;
}
export function DialogReportePedido({ onClose }: ReportePedidoProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FiltrosReportesPedidos>();

  // Para manejar el select con react-hook-form
  const watchEstado = watch("estado");

  const onSubmit: SubmitHandler<FiltrosReportesPedidos> = async (
    data: FiltrosReportesPedidos
  ) => {
    try {
      // Aquí iría la lógica para generar el reporte con los filtros
      console.log("Filtros para reporte:", data);
      reset();
      getReportePedidos(data);
      getReportePedidosExcel(data);
      // window.location.reload(); // Recarga la página para actualizar la lista
      onClose();
    } catch (error) {
      console.error("Error al generar reporte:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-[#1e2745] border-slate-700 text-white">
        <DialogHeader className="space-y-3">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-slate-300" />
            <DialogTitle className="text-xl font-semibold text-white">
              Generar Reporte de Pedidos
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-300">
            Configure los filtros para generar un reporte personalizado.
          </DialogDescription>
          <Separator className="bg-slate-700" />
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="py-2">
          {/* Sección de fechas */}
          <Card className="bg-[#1a2035] border-slate-700 mb-4 p-4">
            <div className="flex items-center mb-3">
              <CalendarIcon className="h-4 w-4 mr-2 text-slate-300" />
              <h3 className="text-sm font-medium text-slate-200">
                Rango de fechas
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="fecha_inicio"
                  className="text-xs text-slate-400"
                >
                  Fecha inicio
                </Label>
                <Input
                  id="fecha_inicio"
                  type="date"
                  {...register("fecha_inicio", { required: "Requerido" })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500 mt-1"
                />
                {errors.fecha_inicio && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.fecha_inicio.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="fecha_fin" className="text-xs text-slate-400">
                  Fecha fin
                </Label>
                <Input
                  id="fecha_fin"
                  type="date"
                  {...register("fecha_fin", { required: "Requerido" })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500 mt-1"
                />
                {errors.fecha_fin && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.fecha_fin.message}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Sección de filtros adicionales */}
          <Card className="bg-[#1a2035] border-slate-700 mb-4 p-4">
            <div className="flex items-center mb-3">
              <Filter className="h-4 w-4 mr-2 text-slate-300" />
              <h3 className="text-sm font-medium text-slate-200">
                Filtros adicionales
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="monto_minimo"
                  className="text-xs text-slate-400"
                >
                  Monto mínimo
                </Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    Bs.
                  </span>
                  <Input
                    id="monto_minimo"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("monto_minimo", {
                      required: "Requerido",
                      valueAsNumber: true,
                    })}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500 pl-10"
                  />
                </div>
                {errors.monto_minimo && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.monto_minimo.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="estado" className="text-xs text-slate-400">
                  Estado del pedido
                </Label>
                <Select
                  onValueChange={(value) => setValue("estado", value)}
                  defaultValue={watchEstado}
                >
                  <SelectTrigger className="mt-1 bg-slate-700 border-slate-600 text-white focus:ring-slate-500">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectItem value="enviado">Enviado</SelectItem>
                    <SelectItem value="entregado">Entregado</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                    <SelectItem value="procesando">Procesando</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("estado", { required: "Requerido" })}
                />
                {errors.estado && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.estado.message}
                  </p>
                )}
              </div>
            </div>
          </Card>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-slate-600 hover:bg-slate-500 text-white flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              {isSubmitting ? "Generando..." : "Generar Reporte"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DialogCrearProps {
  onClose: () => void;
}

export function DialogCrearPedido({ onClose }: DialogCrearProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Pedidos>();

  const onSubmit: SubmitHandler<Pedidos> = async (data) => {
    try {
      await createPedido(data);
      reset();
      window.location.reload(); // Recarga la página para actualizar la lista
      onClose();
    } catch (error) {
      console.error("Error al crear pedido:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#1e2745] border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Crear Pedido
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Complete los campos para registrar un nuevo pedido.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="fecha" className="text-slate-300">
              Fecha
            </Label>
            <Input
              id="fecha"
              type="date"
              {...register("fecha", { required: "La fecha es obligatoria" })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
            />
            {errors.fecha && (
              <p className="text-red-400 text-sm">{errors.fecha.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="total" className="text-slate-300">
              Total
            </Label>
            <Input
              id="total"
              type="number"
              step="0.01"
              {...register("total", { required: "El total es obligatorio" })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
            />
            {errors.total && (
              <p className="text-red-400 text-sm">{errors.total.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="estado" className="text-slate-300">
              Estado
            </Label>
            <Input
              id="estado"
              {...register("estado", { required: "El estado es obligatorio" })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
            />
            {errors.estado && (
              <p className="text-red-400 text-sm">{errors.estado.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="nombre" className="text-slate-300">
              Nombre
            </Label>
            <Input
              id="nombre"
              type="text"
              {...register("nombre", {
                required: "El nombre es obligatorio",
              })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
            />
            {errors.nombre && (
              <p className="text-red-400 text-sm">{errors.nombre.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="pago" className="text-slate-300">
              Pago ID
            </Label>
            <Input
              id="pago"
              type="number"
              {...register("pago", { required: "El pago es obligatorio" })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
            />
            {errors.pago && (
              <p className="text-red-400 text-sm">{errors.pago.message}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-slate-600 hover:bg-slate-500 text-white mt-2"
          >
            {isSubmitting ? "Creando..." : "Crear Pedido"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DialogEditProps {
  pedido: Pedidos;
  onClose: () => void;
}

export function EditPedidoDialog({ pedido, onClose }: DialogEditProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Pedidos>({
    defaultValues: {
      fecha: pedido.fecha,
      total: pedido.total,
      estado: pedido.estado,
      nombre: pedido.nombre,
      pago: pedido.pago,
    },
  });

  const onSubmit: SubmitHandler<Pedidos> = async (data) => {
    try {
      await updatePedido(data);
      reset();
      window.location.reload(); // Recarga la página para actualizar la lista
      onClose();
    } catch (error) {
      console.error("Error al editar pedido:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#1e2745] border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Editar Pedido
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Modifique los campos necesarios para actualizar el pedido.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="fecha" className="text-slate-300">
              Fecha
            </Label>
            <Input
              id="fecha"
              type="date"
              {...register("fecha", { required: "La fecha es obligatoria" })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
            />
            {errors.fecha && (
              <p className="text-red-400 text-sm">{errors.fecha.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="total" className="text-slate-300">
              Total
            </Label>
            <Input
              id="total"
              type="number"
              step="0.01"
              {...register("total", { required: "El total es obligatorio" })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
            />
            {errors.total && (
              <p className="text-red-400 text-sm">{errors.total.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="estado" className="text-slate-300">
              Estado
            </Label>
            <Input
              id="estado"
              {...register("estado", { required: "El estado es obligatorio" })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
            />
            {errors.estado && (
              <p className="text-red-400 text-sm">{errors.estado.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="nombre" className="text-slate-300">
              Nombre
            </Label>
            <Input
              id="nombre"
              type="text"
              {...register("nombre", {
                required: "El nombre es obligatorio",
              })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
            />
            {errors.nombre && (
              <p className="text-red-400 text-sm">{errors.nombre.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="pago" className="text-slate-300">
              Pago ID
            </Label>
            <Input
              id="pago"
              type="number"
              {...register("pago", { required: "El pago es obligatorio" })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
            />
            {errors.pago && (
              <p className="text-red-400 text-sm">{errors.pago.message}</p>
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
  pedido: Pedidos;
  onClose: () => void;
}

export function DialogBorrarPedido({ pedido, onClose }: DialogBorrarProps) {
  const handleDelete = async () => {
    try {
      await deletePedido(pedido.id);
      window.location.reload(); // Recarga la página para actualizar la lista
      onClose();
    } catch (error) {
      console.error("Error al borrar pedido:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#1e2745] border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-red-400">
            Borrar Pedido
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            ¿Está seguro de que desea borrar el pedido con ID{" "}
            <span className="font-bold text-white">{pedido.id}</span>? Esta
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
