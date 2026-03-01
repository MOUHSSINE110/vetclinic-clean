import api from "./axios";

export const login = async (email, password) => {
  try {
    console.log(">>> API : Tentative de login...");
    const response = await api.post("/login", { email, password });
    
    // Récupération du token
    const token = response.data.token || response.data.access_token;

    if (token) {
      localStorage.setItem("token", token);
      
      // Création de l'utilisateur
      const serverUser = response.data.user || response.data;
      const userToStore = {
        id: serverUser?.id || 999,
        name: serverUser?.name || "TEST NOM", // Nom de test
        email: serverUser?.email || email
      };

      localStorage.setItem("user", JSON.stringify(userToStore));
      
     
      console.log(">>> API : User sauvegardé :", userToStore);
    } else {
      alert("ERREUR : Aucun token reçu du serveur.");
    }

    return response.data;
  } catch (error) {
    console.error(">>> API Erreur Login :", error);
    alert("Erreur de connexion : " + error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post("/logout");
  } catch (error) {
    console.error("Erreur serveur logout", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};