import axios from "axios";
import { API_URL } from "../config/api";
import { getToken } from "./authService";

export const getMyProfile = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/auth/me/profile`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return data;
  } catch (error) {
    if (error.response?.status === 404) return null; // alumno sin perfil aún
    throw new Error("No se pudo cargar el perfil.");
  }
};
