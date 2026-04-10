import axios from "axios";
import { API_URL } from "../config/api";

let _token = null;
let _user = null;

export const getToken = () => _token;
export const getUser = () => _user;

export const login = async (email, password) => {
  try {
    const { data } = await axios.post(`${API_URL}/auth/login`, {
      login: email,
      password,
    });
    _token = data.token;
    _user = data.user;
    return data;
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

export const getProfile = async () => {
  const res = await axios.get(`${API_URL}/auth/me/profile`, {
    headers: { Authorization: `Bearer ${_token}` },
  });
  return res.data;
};

export const logout = () => {
  _token = null;
  _user = null;
};
