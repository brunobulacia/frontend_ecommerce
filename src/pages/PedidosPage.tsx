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
import { AlertCircle, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPedidos } from "@/api/pedidos";
import { Pedidos } from "@/types/pedidos";

import { Badge } from "@/components/ui/badge";

const columnHelper = createColumnHelper<Pedidos>();

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedidos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtering, setFiltering] = useState("");

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
    columnHelper.accessor("pago", {
      header: "Pago ID",
      cell: (info) => <span className="text-slate-300">{info.getValue()}</span>,
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
    <div className="p-6 min-h-screen bg-[#1a2035]">
      <Card className="max-w-5xl mx-auto border-slate-700 shadow-md rounded-xl overflow-hidden bg-[#1e2745]">
        <CardHeader className="bg-[#1e2745] border-b border-slate-700 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-white">
              Mis Pedidos
            </CardTitle>
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
              placeholder="Buscar pedido(s)..."
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
    </div>
  );
}
