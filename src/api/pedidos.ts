import axios from "@/lib/axios";
import { Pedidos } from "@/types/pedidos";

export const getPedidos = async () => axios.get("pedidos/venta/");

export const getPedidoByID = async (pedido_id: number) =>
  axios.get(`pedidos/venta/${pedido_id}`);

export const updatePedido = async (pedido: Partial<Pedidos>) =>
  axios.put<Pedidos>("pedidos/venta/", pedido);

export const createPedido = async (pedido: Pedidos) =>
  axios.post("pedidos/venta/", pedido);

export const deletePedido = async (pedido_id: number) =>
  axios.delete(`pedidos/venta/${pedido_id}`);
