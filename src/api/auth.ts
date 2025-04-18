import { UserLogin, createUser } from "@/types/user";
import axios from "@/lib/axios";
export const loginRequest = async (user : UserLogin) =>
  axios.post("login/", user);

export const registerRequest = async (user: createUser) =>
  axios.post("register/", user);
