import api from "./axios";

export const loginRequest = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};
