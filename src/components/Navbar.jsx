
import { NavLink, useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../services/auth.service";


export default function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser(); // 👈 utilisateur connecté

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

{user && (
  <div
    style={{
      marginTop: "auto",
      marginBottom: "10px",
      fontSize: "14px",
      opacity: 0.9,
    }}
  >
    Connecté : <strong>{user.email}</strong>
  </div>
)}
<button onClick={handleLogout}>Déconnexion</button>

/* export default function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser(); // ✅ récupérer l’utilisateur connecté

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
*/
  return (
    <aside
      style={{
        width: "220px",
        background: "#2563eb",
        color: "#fff",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>VetClinic</h2>

      {/* ✅ Email utilisateur */}
      <p
        style={{
          fontSize: "13px",
          color: "#dbeafe",
          marginBottom: "30px",
          wordBreak: "break-all",
        }}
      >
        {user?.email}
      </p>

      <NavItem to="/dashboard">Dashboard</NavItem>
      <NavItem to="/owners">Propriétaires</NavItem>
      <NavItem to="/animals">Animaux</NavItem>
      <NavItem to="/consultations">Consultations</NavItem>
      <NavItem to="/documents">Documents</NavItem>

      <div style={{ flexGrow: 1 }} />

      <button
        onClick={handleLogout}
        style={{
          background: "#1e40af",
          color: "#fff",
          border: "none",
          padding: "10px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Déconnexion
      </button>
    </aside>
  );
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        color: "#fff",
        textDecoration: "none",
        padding: "10px",
        borderRadius: "6px",
        background: isActive ? "#1e40af" : "transparent",
        marginBottom: "6px",
      })}
    >
      {children}
    </NavLink>
  );
}
