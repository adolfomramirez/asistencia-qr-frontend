import axios from "axios";
import { API_URL } from "../config/api";

export const login = async (email, password) => {
  try {
    const { data } = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return data; // Aquí recibes token o datos de sesión
  } catch (error) {
    throw new Error("Credenciales inválidas o error de conexión");
  }
};
