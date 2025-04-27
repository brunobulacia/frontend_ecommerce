import axios from "@/lib/axios";

import { Direccion } from "@/types/direccion";

export const updateDireccionRequest = async (direccion: Partial<Direccion>) =>
  axios.put<Direccion>(`direcciones/${direccion.id}/`, direccion);

export const crearDireccion = async (direccion: Partial<Direccion>) =>
  axios.post<Direccion>("direcciones/", direccion);

export const getDireccionId = async (id: number) =>
  axios.get(`direcciones/${id}/`);
