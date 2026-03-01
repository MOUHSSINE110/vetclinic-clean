import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAnimals } from "../api/animals.api";
import { getOwners } from "../api/owners.api";
import { getConsultations } from "../api/consultations.api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    owners: 0,
    animals: 0,
    consultationsToday: 0,
  });

  const [lastConsultations, setLastConsultations] = useState([]);

  const extractData = (response) => {
    if (Array.isArray(response)) return response;
    if (response && response.data && Array.isArray(response.data)) return response.data;
    return [];
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [animalsRes, ownersRes, consultationsRes] = await Promise.all([
          getAnimals(),
          getOwners(),
          getConsultations()
        ]);

        const animalsData = extractData(animalsRes);
        const ownersData = extractData(ownersRes);
        const consultationsData = extractData(consultationsRes);

        const todayString = new Date().toLocaleDateString('en-CA');

        const countToday = consultationsData.filter((c) => {
          const dateField = c.dateConsultation || c.date; 
          return dateField && dateField.startsWith(todayString);
        }).length;

        setStats({
          owners: ownersData.length,
          animals: animalsData.length,
          consultationsToday: countToday,
        });

        const sortedConsultations = [...consultationsData].sort((a, b) => {
          const dateA = new Date(a.dateConsultation || a.date || 0);
          const dateB = new Date(b.dateConsultation || b.date || 0);
          return dateB - dateA;
        });
        
        const top5 = sortedConsultations.slice(0, 5);
        setLastConsultations(top5);

      } catch (error) {
        console.error("Erreur chargement dashboard:", error);
      }
    };

    loadStats();
  }, []);

  // --- STYLES ---

  const titleStyle = { fontSize: "28px", fontWeight: "bold", marginBottom: "20px" };
  const btnAction = {
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "white",
    border: "none",
    marginRight: "15px"
  };
  const listContainer = {
    marginTop: "40px", background: "#ffffff", border: "1px solid #e5e7eb",
    borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden",
  };
  const listHeader = {
    display: "flex", backgroundColor: "#f9fafb", padding: "12px 20px",
    borderBottom: "1px solid #e5e7eb", fontWeight: "bold", color: "#374151", fontSize: "14px",
  };
  const row = {
    display: "flex", alignItems: "center", padding: "12px 20px",
    borderBottom: "1px solid #f3f4f6", cursor: "pointer", transition: "background 0.2s",
  };
  const cellDate = { flex: 1, color: "#6b7280", fontSize: "13px" };
  const cellMotif = { flex: 3, fontWeight: "500", color: "#111827", fontSize: "14px" };
  const cellCost = { flex: 1, textAlign: "right", fontWeight: "bold", color: "#059669", fontSize: "14px" };
  const statCardStyle = {
    background: "#ffffff", padding: "20px", borderRadius: "8px",
    width: "220px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb",
  };
  const statTitleStyle = { marginBottom: "10px", color: "#555", fontSize: "16px", fontWeight: "500" };
  const statValueStyle = { fontSize: "26px", fontWeight: "bold", color: "#1f2937" };

  return (
    <div style={{ padding: "20px" }}>
      {/* La barre utilisateur a été supprimée ici car elle est dans la Navbar */}
      
      <h1 style={titleStyle}>Dashboard</h1>

      <div style={{ marginBottom: "30px" }}>
        <button onClick={() => navigate("/owners")} style={{ ...btnAction, background: "#10b981" }}>+ Ajouter propriétaire</button>
        <button onClick={() => navigate("/animals")} style={{ ...btnAction, background: "#2563eb" }}>+ Ajouter animal</button>
        <button onClick={() => navigate("/consultations")} style={{ ...btnAction, background: "#f59e0b" }}>+ Ajouter consultation</button>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <StatCard title="Propriétaires" value={stats.owners} color="#10b981" />
        <StatCard title="Animaux" value={stats.animals} color="#2563eb" />
        <StatCard title="Consultations aujourd’hui" value={stats.consultationsToday} color="#f59e0b" />
      </div>

      {lastConsultations.length > 0 && (
        <div style={listContainer}>
          <h3 style={{ padding: "20px 20px 10px 20px", margin: 0, color: "#1f2937" }}>5 Dernières Consultations</h3>
          <div style={listHeader}>
            <div style={cellDate}>Date</div>
            <div style={cellMotif}>Motif</div>
            <div style={cellCost}>Coût</div>
          </div>
          {lastConsultations.map((c) => {
            const dateDisplay = c.dateConsultation || c.date || '-';
            const motifDisplay = c.motif || c.description || 'Pas de motif'; 
            const costDisplay = c.cost || c.prix || '-'; 
            return (
              <div key={c.id} style={row} onClick={() => navigate(`/consultations`)} 
                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                <div style={cellDate}>{dateDisplay}</div>
                <div style={cellMotif}>{motifDisplay}</div>
                <div style={cellCost}>{costDisplay} MAD</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, color }) {
  const cardStyle = {
    background: "#ffffff", padding: "20px", borderRadius: "8px",
    width: "220px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb",
  };
  const h3Style = { marginBottom: "10px", color: "#555", fontSize: "16px", fontWeight: "500" };
  const pStyle = { fontSize: "26px", fontWeight: "bold", color: color || "#1f2937" };
  return (
    <div style={cardStyle}>
      <h3 style={h3Style}>{title}</h3>
      <p style={pStyle}>{value}</p>
    </div>
  );
}