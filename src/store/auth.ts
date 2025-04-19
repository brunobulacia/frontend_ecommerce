import { create } from "zustand";
import { persist } from "zustand/middleware";
import { registerRequest } from "@/api/auth";
import { createUser } from "@/types/user";
import { UserProfile } from "@/types/user";

type State = {
  token: string;
  isAuth: boolean;
  errors: any;
  profile: UserProfile; // Agregamos el perfil al estado
};

type Actions = {
  setToken: (token: string) => void;
  setProfile: (profile: UserProfile) => void; // Setter para el perfil
  getProfile: () => UserProfile | null; // Getter para el perfil
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
      }, // Inicializamos el perfil como null
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
          },
        })), // Limpiamos el perfil al cerrar sesión
      cleanErrors: () => set(() => ({ errors: null })),
    }),
    {
      name: "auth",
    }
  )
);
