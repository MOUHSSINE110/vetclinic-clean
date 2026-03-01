import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth.api";

export default function MainLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const linkStyle = {
    background: "none",
    border: "none",
    color: "white",
    textAlign: "left",
    padding: "10px 0",
    cursor: "pointer",
    fontSize: "16px",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>

      {/* --- NAVBAR LATÉRALE --- */}
      <aside
        style={{
          width: "260px",
          backgroundColor: "#1e40af",
          color: "white",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "40px", fontSize: "24px", fontWeight: "bold" }}>
          VetClinic
        </h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button style={linkStyle} onClick={() => navigate("/dashboard")}>
            📊 Dashboard
          </button>
          <button style={linkStyle} onClick={() => navigate("/animals")}>
            🐾 Animaux
          </button>
          <button style={linkStyle} onClick={() => navigate("/owners")}>
            👤 Propriétaires
          </button>

          {/* --- AJOUT DU BOUTON CONSULTATIONS --- */}
          <button style={linkStyle} onClick={() => navigate("/consultations")}>
            🩺 Consultations
          </button>

          <button style={linkStyle} onClick={() => navigate("/documents")}>
            📄 Documents
          </button>

        </nav>

        <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.3)", paddingTop: "20px" }}>
          <button
            onClick={handleLogout}
            style={{ ...linkStyle, color: "#fca5a5", fontWeight: "bold" }}
          >
            🚪 Déconnexion
          </button>
        </div>
      </aside>

      {/* --- CONTENU PRINCIPAL --- */}
      <main style={{ flex: 1, backgroundColor: "#f3f4f6", padding: "30px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}