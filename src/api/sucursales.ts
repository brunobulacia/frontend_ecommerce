import axios from "@/lib/axios";
import { Sucursal } from "@/types/sucursal";

export const getSucursales = () => axios.get("sucursales/sucursales");

export const getSucursalById = (id: number) =>
  axios.get(`sucursales/sucursales${id}/`);

export const createSucursal = (sucursal: Omit<Sucursal, "id">) =>
  axios.post("sucursales/sucursales", sucursal);

export const updateSucursal = (id: number, sucursal: Partial<Sucursal>) => {
  console.log(sucursal);
  return axios.put<Sucursal>(`sucursales/sucursales${id}/`, sucursal);
};

export const deleteSucursal = (id: number) =>
  axios.delete(`sucursales/sucursales${id}/`);
