import axios from "@/lib/axios";

export interface Usuarios {
  id: number;
  last_login: string;
  nombre: string;
  apellidos: string;
  rol: string;
  correo: string;
}

export const getUsuarios = async () => axios.get("usuarios/");

export const getUsuarioById = async (id: number) => axios.get(`usuarios/${id}`);

export const createUsuario = async (user: Usuarios) =>
  axios.post("usuarios/", user);

export const updateUsuario = async (id: number, user: Partial<Usuarios>) =>
  axios.put(`usuarios/${id}`, user);

export const deleteUsuario = async (id: number) =>
  axios.delete(`usuarios/${id}`);
