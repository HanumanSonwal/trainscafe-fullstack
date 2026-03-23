import { LoginFormData, LoginResponse } from "@/types/auth.types";
import api from "./api";
import { User } from "@/types/user.types";
import { ApiResponse } from "@/types/api.types";

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {

  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const getMe = async (): Promise<ApiResponse<User>> => {

  const response = await api.get("/auth/me");

  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};