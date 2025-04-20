import { create } from "zustand";
import { persist } from "zustand/middleware";
import { registerRequest } from "@/api/auth";
import { createUser } from "@/types/user";
import { UserProfile } from "@/types/user";
import { UserDirection } from "@/types/direccion";

type State = {
  token: string;
  isAuth: boolean;
  errors: any;
  profile: UserProfile; // Perfil del usuario
  directions: UserDirection; // Direcciones del usuario
};

type Actions = {
  setToken: (token: string) => void;
  setProfile: (profile: UserProfile) => void; // Setter para el perfil
  getProfile: () => UserProfile | null; // Getter para el perfil
  setDirection: (direction: UserDirection) => void; // Setter para las direcciones
  getDirection: () => UserDirection | null; // Getter para las direcciones
  register: (user: createUser) => void;
  logout: () => void;
  cleanErrors: () => void;
};

export const useAuthStore = create(
  persist<State & Actions>(
    (set, get) => ({
      token: "",
      isAuth: false,
      errors: null,
      profile: {
        nombre: "",
        correo: "",
        apellidos: "",
        rol: 0,
        id: 0,
      }, // Inicializamos el perfil
      directions: {
        id: 0,
        departamento: { id: 0, nombre: "" },
        pais: "",
        ciudad: "",
        zona: "",
        calle: "",
        numero: "",
        referencia: "",
      }, // Inicializamos las direcciones como null
      setToken: (token: string) =>
        set(() => ({
          token,
          isAuth: !!token,
        })),
      setProfile: (profile: UserProfile) =>
        set(() => ({
          profile,
        })), // Setter para actualizar el perfil
      getProfile: () => {
        const profile = get().profile;
        return profile;
      }, // Getter para obtener el perfil
      setDirection: (direction: UserDirection) =>
        set(() => ({
          directions: direction,
        })), // Setter para actualizar las direcciones
      getDirection: () => {
        const direction = get().directions;
        return direction;
      }, // Getter para obtener las direcciones
      register: async (user: createUser) => {
        try {
          const resRegister = await registerRequest(user);
          set(() => ({
            token: resRegister.data.token,
            isAuth: true,
          }));
        } catch (error) {
          set(() => ({
            errors: (error as any)?.response?.data || (error as Error).message,
          }));
        }
      },
      logout: () =>
        set(() => ({
          token: "",
          isAuth: false,
          profile: {
            nombre: "",
            correo: "",
            apellidos: "",
            rol: 0,
            id: 0,
          },
          directions: {
            id: 0,
            departamento: { id: 0, nombre: "" },
            pais: "",
            ciudad: "",
            zona: "",
            calle: "",
            numero: "",
            referencia: "",
          }, // Limpiamos las direcciones al cerrar sesión
        })), // Limpiamos el perfil y las direcciones al cerrar sesión
      cleanErrors: () => set(() => ({ errors: null })),
    }),
    {
      name: "auth",
    }
  )
);
