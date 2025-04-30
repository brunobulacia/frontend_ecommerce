import axios from "@/lib/axios";

export interface crearVentaT {
  sucursal_id: number;
  metodo_id_pago: number;
  direccion_id: number;
}

export const crearVenta = async (venta: crearVentaT) =>
  axios.post("pedidos/venta/", venta);

export const crearPago = async (id_pago: number) =>
  axios.post(`pedidos/pago/${id_pago}/confirmar_pago/`);
