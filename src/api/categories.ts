import axios from "@/lib/axios";
export const getCategories = async () => await axios.get("/productos/categorias/");