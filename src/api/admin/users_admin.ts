import axios from "@/lib/axios";

export interface Users {
  id: number;
  last_login: string;
  nombre: string;
  correo: string;
  apellidos: string;
  rol: string;
}

export const getUsers = async () => axios.get("usuarios");
