import axios from "@/lib/axios";
import { saveAs } from "file-saver"; // Instalar con: npm install file-saver
import {
  FiltrosReportesPedidos,
  FiltrosReportesStocks,
} from "@/types/reportes";

export const getReportePedidos = async (filtros: FiltrosReportesPedidos) => {
  const response = await axios.get("/pedidos/reporte-venta", {
    params: filtros,
    responseType: "blob",
  });
  const pdfBlob = new Blob([response.data], { type: "application/pdf" });
  saveAs(pdfBlob, "reporte-venta.pdf");
};

export const getReportePedidosExcel = async (
  filtros: FiltrosReportesPedidos
) => {
  const response = await axios.get("/pedidos/reporte-venta-excel", {
    params: filtros,
    responseType: "blob",
  });
  const excelBlob = new Blob([response.data], {
    type: "application/vnd.ms-excel",
  });
  saveAs(excelBlob, "reporte-venta-excel.xlsx");
};

export const getReporteStocks = async (filtros: FiltrosReportesStocks) => {
  const response = await axios.get("/productos/reporte-stock-pdf", {
    params: filtros,
    responseType: "blob",
  });
  const pdfBlob = new Blob([response.data], { type: "application/pdf" });
  saveAs(pdfBlob, "reporte-stock.pdf");
};

export const getReporteStocksExcel = async (filtros: FiltrosReportesStocks) => {
  const response = await axios.get("/productos/reporte-stock-excel", {
    params: filtros,
    responseType: "blob",
  });
  const excelBlob = new Blob([response.data], {
    type: "application/vnd.ms-excel",
  });
  saveAs(excelBlob, "reporte-stock-excel.xlsx");
};
