import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    padding: "10px",
    marginBottom: "5px",
    display: "block",
    borderRadius: "4px",
    transition: "background 0.2s"
  };

  return (
    <div style={{
        width: "260px",
        height: "100vh",
        backgroundColor: "#2563eb", // BLEU VETCLINIC
        color: "#fff",
        padding: "25px 20px",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        fontFamily: "sans-serif"
    }}>
      
      {/* --- LOGO --- */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
            fontSize: "24px", 
            fontWeight: "bold", 
            letterSpacing: "1px", 
            display: "flex", 
            alignItems: "center" 
        }}>
            📊 VetClinic
        </h2>
      </div>

      {/* --- INFO UTILISATEUR --- */}
      <div style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          padding: "15px", 
          borderRadius: "8px", 
          marginBottom: "30px" 
      }}>
          <span style={{ 
              color: "#bfdbfe", 
              fontSize: "12px", 
              textTransform: "uppercase", 
              letterSpacing: "0.5px", 
              display: "block", 
              marginBottom: "5px" 
          }}>
              Connecté :
          </span>
          <div style={{ 
              color: "#ffffff", 
              fontSize: "15px", 
              fontWeight: "bold", 
              wordBreak: "break-word" 
          }}>
              {user ? user.name : "Inconnu"}
          </div>
          {user && (
            <div style={{ color: "#dbeafe", fontSize: "13px", marginTop: "2px" }}>
                {user.email}
            </div>
          )}
      </div>

      {/* --- MENU DE NAVIGATION --- */}
      <nav style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <NavLink to="/" style={({ isActive }) => ({ ...linkStyle, background: isActive ? "#1e40af" : "transparent" })}>
          📊 Dashboard
        </NavLink>
        
        <NavLink to="/owners" style={({ isActive }) => ({ ...linkStyle, background: isActive ? "#1e40af" : "transparent" })}>
          👤 Propriétaires
        </NavLink>
        
        <NavLink to="/animals" style={({ isActive }) => ({ ...linkStyle, background: isActive ? "#1e40af" : "transparent" })}>
          🐾 Animaux
        </NavLink>
        
        <NavLink to="/consultations" style={({ isActive }) => ({ ...linkStyle, background: isActive ? "#1e40af" : "transparent" })}>
          🩺 Consultations
        </NavLink>
        
        <NavLink to="/documents" style={({ isActive }) => ({ ...linkStyle, background: isActive ? "#1e40af" : "transparent" })}>
          📄 Documents
        </NavLink>

        {/* --- LIEN ADMIN SEULEMENT (CORRIGÉ : Placé AVANT la fermeture </nav>) --- */}
        {user && user.id === 1 && (
          <NavLink to="/vets" style={({ isActive }) => ({ 
              ...linkStyle, 
              background: isActive ? "#1e40af" : "transparent", 
              marginTop: "10px", 
              borderTop: "1px solid rgba(255,255,255,0.2)", 
              paddingTop: "10px" 
          })}>
            🛡️ Gestion Vétérinaires
          </NavLink>
        )}
        {/* ----------------------------------------------------------------------------------------- */}
      </nav>

      {/* --- BOUTON DÉCONNEXION --- */}
      <button onClick={handleLogout} style={{
          background: "rgba(255, 255, 255, 0.15)",
          color: "#fff",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          padding: "12px",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s"
      }}>
        Déconnexion
      </button>

    </div>
  );
}