import axios from "@/lib/axios";
import { useAuthStore } from "@/store/auth";
const { token } = useAuthStore.getState();

export interface crearCarrito {
  usuario: number;
  estado: string;
}

export interface addItemCart {
  cart: number;
  producto: number;
  cantidad: number;
}

export interface cerrarCarrito {
  carrito: number;
  estado: string;
  usuario: number;
}

export const createCarrito = async (carrito: crearCarrito) =>
  axios.post("pedidos/carts/", carrito);

export const getCarrito = async (id: number) =>
  axios.get(`pedidos/carts/?usuario_id=${id}/`);

export const updateCarrito = async (carrito: cerrarCarrito) =>
  axios.put(`pedidos/carts/${carrito.carrito}/`, carrito, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

export const getItems = async (id: number) =>
  axios.get(`pedidos/itemcarts/?cart_id=${id}/`);

export const addItem = async (item: addItemCart) =>
  axios.post("pedidos/itemcarts/", item);

export const deleteItem = async (id: number) =>
  axios.delete(`pedidos/itemcarts/${id}/`);

export const getRecomendaciones = async () =>
  axios.get("pedidos/itemcarts/recomendaciones/");
