import axios from "@/lib/axios";
import { SucursalStock } from "@/types/stock";

export const getSucursales = () => axios.get("productos/stocks/");

export const getSucursalById = (id: number) =>
  axios.get(`productos/stocks/${id}/`);

export const createSucursal = (sucursal: Omit<SucursalStock, "id">) =>
  axios.post("productos/stocks/", sucursal);

export const updateSucursal = (
  id: number,
  sucursal: Partial<SucursalStock>
) => {
  console.log(sucursal);
  return axios.put<SucursalStock>(`productos/stocks/${id}/`, sucursal);
};

export const deleteSucursal = (id: number) =>
  axios.delete(`productos/stocks/${id}/`);
