import axios from "@/lib/axios";

export interface crearCarrito {
  usuario: number;
  estado: "activo";
}

export const createCarrito = async (carrito: crearCarrito) =>
  axios.post("pedidos/carts", carrito);
