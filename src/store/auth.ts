import {create} from "zustand";
import { persist } from "zustand/middleware";
import { registerRequest } from "@/api/auth";
import { createUser } from "@/types/user";
import { Profile } from "@/types/user";

type State = {
  token: string;
  isAuth: boolean;
  errors: any;
  profile: Profile | null; // Agregamos el perfil al estado
};

type Actions = {
  setToken: (token: string) => void;
  setProfile: (profile: Profile) => void; // Setter para el perfil
  getProfile: () => Profile | null; // Getter para el perfil
  register: (user: createUser) => void;
  logout: () => void;
  cleanErrors: () => void;
};

export const useAuthStore = create(
    persist<State & Actions>(
        (set, get) => ({
            token: '',
            isAuth: false,
            errors: null,
            profile: null, // Inicializamos el perfil como null
            setToken: (token: string) =>
                set(() => ({
                    token,
                    isAuth: !!token,
                })),
            setProfile: (profile: Profile) =>
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
                    set(() => ({ errors: (error as any)?.response?.data || (error as Error).message }));
                }
            },
            logout: () => set(() => ({ token: '', isAuth: false, profile: null })), // Limpiamos el perfil al cerrar sesión
            cleanErrors: () => set(() => ({ errors: null })),
        }),
        {
            name: "auth",
        }
    )
);
