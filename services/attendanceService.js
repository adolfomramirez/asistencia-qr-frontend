import axios from "axios";
import { API_URL } from "../config/api";
import { getToken } from "./authService";

export const getMyAttendanceSummary = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/auth/me/attendance/summary`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return data;
  } catch {
    throw new Error("No se pudo cargar el resumen de asistencia.");
  }
};

export const getMyRecentAttendances = async (limit = 5) => {
  try {
    const { data } = await axios.get(`${API_URL}/auth/me/attendance/recent`, {
      params: { limit },
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return data.items || [];
  } catch {
    throw new Error("No se pudo cargar el historial de asistencias.");
  }
};
