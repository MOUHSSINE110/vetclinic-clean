import api from "../services/axios"; // Assurez-vous que le chemin correspond à votre fichier axios

export const login = async (email, password) => {
  const response = await api.post("/login", { email, password });
  // Laravel renvoie { token, user, ... }
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = async () => {
  try {
    await api.post("/logout");
  } catch (error) {
    console.error("Erreur logout", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};