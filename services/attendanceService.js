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

// NUEVO: registrar asistencia con QR
export const registerAttendance = async (qrToken, studentId) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/attendance/scan`,
      { token: qrToken, photoUrl: "https://via.placeholder.com/150" },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || error.response.data?.error || "Error al registrar asistencia.");
    }
    throw new Error("No se pudo conectar al servidor.");
  }
};
