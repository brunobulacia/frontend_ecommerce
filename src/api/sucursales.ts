import axios from "@/lib/axios";
import { Sucursal } from "@/types/sucursal";

export const getSucursales = () => axios.get("productos/stocks/");

export const getSucursalById = (id: number) =>
  axios.get(`productos/stocks/${id}/`);

export const createSucursal = (sucursal: Omit<Sucursal, "id">) =>
  axios.post("productos/stocks/", sucursal);

export const updateSucursal = (id: number, sucursal: Partial<Sucursal>) => {
  console.log(sucursal);
  return axios.put<Sucursal>(`productos/stocks/${id}/`, sucursal);
};

export const deleteSucursal = (id: number) =>
  axios.delete(`productos/stocks/${id}/`);
