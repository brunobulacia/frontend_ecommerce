import axios from "@/lib/axios";

import { UpdateDireccionRequest } from "@/types/direccion";

export const updateDireccionRequest = async (
  direccion: UpdateDireccionRequest
) => {
  console.log(direccion.id_direccion);
  return axios.put(`direcciones/${direccion.id_direccion}/`, direccion);
};
