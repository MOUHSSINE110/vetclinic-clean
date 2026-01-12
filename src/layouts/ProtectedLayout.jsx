import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
      }}
    >
      {/* Barre de navigation à gauche */}
      <Navbar />

      {/* Contenu des pages */}
      <main
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
