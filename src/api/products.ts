import axios from "@/lib/axios";

export const getProducts = async () => await axios.get("products/");

