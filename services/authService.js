import axios from "axios";
import { API_URL } from "../config/api";

export const login = async (email, password) => {
  try {
    const { data } = await axios.post(`${API_URL}/auth/login`, {
      login: email,
      password,
    });
    return data; // Aquí recibes token o datos de sesión
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error;

      if (status === 400) throw new Error(message || "Faltan credenciales requeridas.");
      if (status === 401) throw new Error("Contraseña o usuario incorrectos.");
      if (status === 500) throw new Error("Error interno del servidor. Intenta más tarde.");
    }
    throw new Error("No se pudo conectar al servidor. Verifica tu conexión.");
  }
};
