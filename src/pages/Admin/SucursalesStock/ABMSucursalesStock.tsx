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
  BarChart3,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Edit,
  FileText,
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
} from "@/api/stock";

import { SucursalStock } from "@/types/stock";

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

import { getReporteStocks, getReporteStocksExcel } from "@/api/reportes";
import { FiltrosReportesStocks } from "@/types/reportes";
import { Separator } from "@radix-ui/react-dropdown-menu";

// PARA CARGAR LOS DROPDOWNS
import { Sucursal } from "@/types/sucursal";
import { Product } from "@/types/products";
import { getSucursales as getSucursalesDropdown } from "@/api/sucursales";
import { getProducts } from "@/api/products";

//COMPONENTES DROPDOWN
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const columnHelper = createColumnHelper<SucursalStock>();

export default function ABMSucursalesStock() {
  const [sucursales, setSucursales] = useState<SucursalStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtering, setFiltering] = useState("");
  const [showDialogCrear, setShowDialogCrear] = useState(false);
  const [showDialogEditar, setShowDialogEditar] = useState(false);
  const [showDialogBorrar, setShowDialogBorrar] = useState(false);
  const [selectedSucursal, setSelectedSucursal] =
    useState<SucursalStock | null>(null);
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

  const handleEditar = (sucursal: SucursalStock) => {
    setSelectedSucursal(sucursal);
    setShowDialogEditar(true);
  };

  const handleEliminar = (sucursal: SucursalStock) => {
    setSelectedSucursal(sucursal);
    setShowDialogBorrar(true);
  };

  const crearSucursal = () => {
    setShowDialogCrear(true);
  };

  const generarReporte = () => {
    setShowDialogReporte(true);
  };

  useEffect(() => {
    async function fetchSucursales() {
      try {
        const res = await getSucursales();
        console.log(res);
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
                onClick={generarReporte}
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

      {showDialogReporte && (
        <DialogReporteStock
          onClose={() => setShowDialogReporte(false)}
          getReporteStocks={getReporteStocks}
        />
      )}

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

interface ReporteStockProps {
  onClose: () => void;
  getReporteStocks: (data: FiltrosReportesStocks) => void;
}

// Bolivia departments
const DEPARTAMENTOS_BOLIVIA = [
  "Santa Cruz",
  "La Paz",
  "Cochabamba",
  "Tarija",
  "Chuquisaca",
  "Beni",
  "Oruro",
  "Potosi",
  "Pando",
];

export function DialogReporteStock({
  onClose,
  getReporteStocks,
}: ReporteStockProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FiltrosReportesStocks>();

  const [sucursalesDropdown, setSucursalesDropdown] = useState<Sucursal[]>([]);
  const [productsDropdown, setProductsDropdown] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSucursalesProductos = async () => {
      try {
        const response = await getSucursalesDropdown();
        const resProd = await getProducts();
        setSucursalesDropdown(response.data);
        setProductsDropdown(resProd.data);
      } catch (error) {
        console.error("Error al obtener sucursales o productos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSucursalesProductos();
  }, []);

  const onSubmit: SubmitHandler<FiltrosReportesStocks> = async (
    data: FiltrosReportesStocks
  ) => {
    try {
      // Aquí iría la lógica para generar el reporte con los filtros
      console.log("Filtros para reporte:", data);
      getReporteStocks(data);
      getReporteStocksExcel(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error al generar reporte:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto bg-[#1e2745] border-slate-700 text-white">
        <DialogHeader className="space-y-2">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-slate-300" />
            <DialogTitle className="text-lg font-semibold text-white">
              Generar Reporte de Stocks
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-300 text-sm">
            Configure los filtros para generar un reporte personalizado.
          </DialogDescription>
          <Separator className="bg-slate-700" />
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="py-2 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Sección de Sucursal - Select */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-300 flex items-center">
                <Search className="h-3 w-3 mr-1 text-slate-400" />
                Sucursal
              </Label>
              <Select
                onValueChange={(value) =>
                  setValue("sucursal", value, { shouldValidate: true })
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:ring-slate-500 h-9">
                  <SelectValue placeholder="Seleccionar sucursal" />
                </SelectTrigger>
                <SelectContent
                  className="bg-slate-800 border-slate-700 text-slate-200 max-h-[180px]"
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={5}
                >
                  <SelectItem value="Todos">Todos</SelectItem>
                  {sucursalesDropdown.map((sucursal) => (
                    <SelectItem key={sucursal.id} value={sucursal.nombre}>
                      {sucursal.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register("sucursal", { required: "Sucursal es requerida" })}
              />
              {errors.sucursal && (
                <p className="text-red-400 text-xs">
                  {errors.sucursal.message}
                </p>
              )}
            </div>

            {/* Sección de Departamento - Select */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-300 flex items-center">
                <FileText className="h-3 w-3 mr-1 text-slate-400" />
                Departamento
              </Label>
              <Select
                onValueChange={(value) =>
                  setValue("departamento", value, { shouldValidate: true })
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:ring-slate-500 h-9">
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent
                  className="bg-slate-800 border-slate-700 text-slate-200"
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={5}
                >
                  <SelectItem value="Todos">Todos</SelectItem>
                  {DEPARTAMENTOS_BOLIVIA.map((departamento) => (
                    <SelectItem key={departamento} value={departamento}>
                      {departamento}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register("departamento", {
                  required: "Departamento es requerido",
                })}
              />
              {errors.departamento && (
                <p className="text-red-400 text-xs">
                  {errors.departamento.message}
                </p>
              )}
            </div>

            {/* Sección de Producto - Select */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-300 flex items-center">
                <Search className="h-3 w-3 mr-1 text-slate-400" />
                Producto
              </Label>
              <Select
                onValueChange={(value) =>
                  setValue("producto", value, { shouldValidate: true })
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:ring-slate-500 h-9">
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent
                  className="bg-slate-800 border-slate-700 text-slate-200 max-h-[180px]"
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={5}
                >
                  <SelectItem value="Todos">Todos</SelectItem>
                  {productsDropdown.map((producto) => (
                    <SelectItem key={producto.id} value={producto.nombre}>
                      {producto.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register("producto", { required: "Producto es requerido" })}
              />
              {errors.producto && (
                <p className="text-red-400 text-xs">
                  {errors.producto.message}
                </p>
              )}
            </div>

            {/* Sección de Stock Mínimo */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-300 flex items-center">
                <CalendarIcon className="h-3 w-3 mr-1 text-slate-400" />
                Stock Mínimo
              </Label>
              <Input
                id="stock_minimo"
                type="number"
                {...register("stock_minimo", {
                  required: "Stock mínimo es requerido",
                })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500 h-9"
              />
              {errors.stock_minimo && (
                <p className="text-red-400 text-xs">
                  {errors.stock_minimo.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white h-9"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-slate-600 hover:bg-slate-500 text-white flex items-center gap-2 h-9"
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
  } = useForm<SucursalStock>();

  const onSubmit: SubmitHandler<SucursalStock> = async (data) => {
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
  sucursal: Partial<SucursalStock>;
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
  sucursal: SucursalStock;
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
