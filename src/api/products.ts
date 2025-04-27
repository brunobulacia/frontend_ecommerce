import axios from "@/lib/axios";

export const getProducts = async () => await axios.get("/productos/productos/");

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  proveedor: string;
  descuento: number | null;
  imagenes: string[];
  stock_total: number;
  detalle: {
    marca: string;
    precio: number;
  };
  categorias: {
    nombre: string;
    descripcion: string;
  }[];
}

export const getProductById = async (id: number) =>
  await axios.get<Producto>(`/productos/productos/${id}/`);

export const createProduct = async (product: Producto) =>
  await axios.post<Producto>("/productos/productos/", product);

export const updateProduct = async (product: Partial<Producto>) =>
  await axios.put<Producto>(`/productos/productos/${product.id}/`, product);

export const deleteProduct = async (id: number) =>
  await axios.delete(`/productos/productos/${id}/`);

export const filtrarProductos = async (param: string) =>
  axios.get(`/productos/productos/?${param}`);
