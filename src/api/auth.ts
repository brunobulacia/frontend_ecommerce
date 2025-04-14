import { createUser, UserLogin } from "@/types/user";
import axios from "@/lib/axios";

export const loginRequest = async (user : UserLogin) =>
  axios.post("auth/login/", user);

export const registerRequest = async (data: createUser) =>
  axios.post("auth/register", data);
