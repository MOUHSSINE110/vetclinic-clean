import { useEffect, useState } from "react";

export default function OwnerForm({ onSubmit, selectedOwner }) {
  const [form, setForm] = useState({
    id_prop: "",
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (selectedOwner) {
      setForm(selectedOwner);
    } else {
      // Génération automatique ID propriétaire
      setForm({
        id_prop: `PROP-${Date.now()}`,
        name: "",
        address: "",
        phone: "",
        email: "",
      });
    }
  }, [selectedOwner]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>{selectedOwner ? "Modifier" : "Ajouter"} un propriétaire</h3>

     <div style={styles.field}>
  <label><strong>ID Propriétaire :</strong></label>
  <input value={form.id_prop} disabled />
</div>

<div style={styles.field}>
  <label><strong>Nom & Prénom :</strong></label>
  <input
    name="name"
    value={form.name}
    onChange={handleChange}
    required
  />
</div>

<div style={styles.field}>
  <label><strong>Adresse :</strong></label>
  <input
    name="address"
    value={form.address}
    onChange={handleChange}
  />
</div>

<div style={styles.field}>
  <label><strong>Téléphone :</strong></label>
  <input
    name="phone"
    value={form.phone}
    onChange={handleChange}
  />
</div>

<div style={styles.field}>
  <label><strong>Email :</strong></label>
  <input
    name="email"
    type="email"
    value={form.email}
    onChange={handleChange}
  />
</div>

<button
  type="submit"
  style={styles.button}
  disabled={!form.name}
>
  ➕ Ajouter le propriétaire
</button>
    </form>
  );
}

const styles = {
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "10px",
    width: "300px", // ⬅ largeur réduite
  },

  input: {
    padding: "6px 8px", // ⬅ champ plus petit
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  button: {
    marginTop: "10px",
    width: "200px", // ⬅ bouton plus petit
    padding: "8px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

