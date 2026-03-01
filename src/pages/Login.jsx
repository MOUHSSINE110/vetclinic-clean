import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, isAuthenticated } from "../api/auth.api";

export default function LoginPage() {
  const navigate = useNavigate();

  // États pour gérer les champs du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 1. Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // 2. Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      // Appel à l'API
      const response = await login(email, password);
      
      // --- AJOUT IMPORTANT : Sauvegarder les infos dans le localStorage ---
      // C'est indispensable pour que le Sidebar reconnaisse l'ID de l'utilisateur
      localStorage.setItem("token", response.token);
      
      if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
      }
      // ---------------------------------------------------------------------

      // Succès : on redirige
      console.log("Connexion réussie", response);
      navigate("/dashboard");
      
    } catch (err) {
      console.error("Erreur de connexion:", err);
      
      // Affichage d'un message d'erreur clair
      if (err.response && err.response.status === 401) {
        setError("Email ou mot de passe incorrect.");
      } else {
        setError("Impossible de contacter le serveur. Vérifiez que l'API Laravel tourne.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Connexion Vétérinaire</h2>

        {/* Affichage de l'erreur si elle existe */}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          
          {/* Champ Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email :</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vet.com"
              required
              style={styles.input}
            />
          </div>

          {/* Champ Mot de passe */}
          <div style={styles.field}>
            <label style={styles.label}>Mot de passe :</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Styles CSS simples pour la mise en page ---
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f3f4f6", // Gris clair en fond
  },
  card: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#1f2937",
  },
  error: {
    backgroundColor: "#fee2e2", // Rouge très clair
    color: "#b91c1c", // Rouge foncé
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "1rem",
    textAlign: "center",
    fontSize: "0.9rem",
  },
  field: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#374151",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    boxSizing: "border-box", // Important pour ne pas dépasser
    fontSize: "1rem",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#2563eb", // Bleu Laravel
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "0.5rem",
    fontWeight: "bold",
  },
};