import axios from "axios";
import { API_URL } from "../config/api";

export const getUsers = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/users`);
    return data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

export const createUser = async (user) => {
  try {
    const { data } = await axios.post(`${API_URL}/users`, user);
    return data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};
