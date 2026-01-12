import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

/**
 * Requête de login
 */
export const loginRequest = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};
