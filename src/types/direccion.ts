export interface UserDirection {
  id: number;
  departamento: Departamento;
  pais: string;
  ciudad: string;
  zona: string;
  calle: string;
  numero: string;
  referencia: string;
}

export interface Departamento {
  id: number;
  nombre: string;
}

export interface UpdateDireccionRequest {
  id_direccion: number;
  pais: string;
  departamento: string;
  ciudad: string;
  zona: string;
  calle: string;
  numero: string;
  referencia: string;
}
