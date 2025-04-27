export interface FiltrosReportesPedidos {
  fecha_inicio: string;
  fecha_fin: string;
  monto_minimo: number;
  estado: string;
}

export interface FiltrosReportesStocks {
  sucursal: string;
  departamento: string;
  producto: string;
  stock_minimo: number;
}
