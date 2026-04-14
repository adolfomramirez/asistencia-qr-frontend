import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../config/api";

let _token = null;
let _user = null;

export const getToken = () => _token;
export const getUser = () => _user;

export const loadAuthData = async () => {
  const token = await AsyncStorage.getItem("authToken");
  const user = await AsyncStorage.getItem("authUser");
  _token = token;
  _user = user ? JSON.parse(user) : null;
};

export const login = async (email, password) => {
  try {
    const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
    const payload = data?.data ?? data;
    _token = payload?.token ?? null;
    _user = payload?.user ?? null;

    if (!_token || !_user) throw new Error("Respuesta de autenticación inválida.");

    // ✅ Guardar en AsyncStorage
    await AsyncStorage.setItem("authToken", _token);
    await AsyncStorage.setItem("authUser", JSON.stringify(_user));

    return payload;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error;
      if (status === 400) throw new Error(message || "Correo electrónico o contraseña inválidos.");
      if (status === 401) throw new Error(message || "Correo o contraseña incorrectos.");
      if (status === 403) throw new Error(message || "Tu cuenta está inactiva. Contacta al administrador.");
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

export const logout = async () => {
  _token = null;
  _user = null;
  await AsyncStorage.removeItem("authToken");
  await AsyncStorage.removeItem("authUser");
};
