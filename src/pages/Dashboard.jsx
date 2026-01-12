export default function Dashboard() {
  // Fake data
  const stats = {
    owners: 12,
    animals: 27,
    consultationsToday: 5,
  };

  return (
    <div>
      {/* Titre */}
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
        Dashboard
      </h1>

      {/* Boutons actions */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
        <button className="primary-btn">+ Ajouter propriétaire</button>
        <button className="primary-btn">+ Ajouter animal</button>
        <button className="primary-btn">+ Ajouter consultation</button>
      </div>

      {/* Cartes statistiques */}
      <div style={{ display: "flex", gap: "20px" }}>
        <StatCard title="Propriétaires" value={stats.owners} />
        <StatCard title="Animaux" value={stats.animals} />
        <StatCard
          title="Consultations aujourd’hui"
          value={stats.consultationsToday}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "8px",
        width: "220px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginBottom: "10px", color: "#555" }}>{title}</h3>
      <p style={{ fontSize: "26px", fontWeight: "bold" }}>{value}</p>
    </div>
  );
}
