export interface createUser {
  nombre: string;
  password: string;
  apellidos: string;
  correo: string;
}

export interface UserLogin {
  // username: string;
  password: string;
  correo: string;
}

export interface UserProfile {
  id: number;
  nombre: string;
  correo: string;
  apellidos: string;
  rol: number;
  direccion: number;
}

export interface updateUser {
  nombre: string;
  correo: string;
  apellidos: string;
}
