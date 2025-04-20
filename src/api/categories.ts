import axios from "@/lib/axios";

export interface Category {
  id: number;
  nombre: string;
  descripcion: string;
}

export const getCategories = async () =>
  await axios.get("/productos/categorias/");

export const getCategoryById = async (id: number) =>
  await axios.get<Category>(`/productos/categorias/${id}/`);

export const createCategory = async (category: Partial<Category>) =>
  await axios.post<Category>("/productos/categorias/", category);

export const updateCategory = async (category: Partial<Category>) =>
  await axios.put<Category>(`/productos/categorias/${category.id}/`, category);

export const deleteCategory = async (id: number) =>
  await axios.delete(`/productos/categorias/${id}/`);
