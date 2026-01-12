import { useEffect, useState } from "react";
import {
  getOwners,
  createOwner,
  deleteOwner,
  updateOwner,
} from "../api/owners.api";

export default function OwnersList() {
  /* ========================
     STATES
  ======================== */
  const [owners, setOwners] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  /* ========================
     CHARGEMENT INITIAL
  ======================== */
  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    const data = await getOwners();
    setOwners(data || []);
  };

  /* ========================
     FORMULAIRE
  ======================== */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      const updatedOwner = { id: editingId, ...formData };
      await updateOwner(editingId, updatedOwner);

      setOwners(
        owners.map((o) => (o.id === editingId ? updatedOwner : o))
      );
    } else {
      const newOwner = {
        id: Date.now(), // ✅ ID auto
        ...formData,
      };
      await createOwner(newOwner);
      setOwners([...owners, newOwner]);
    }

    resetForm();
  };

  const handleEdit = (owner) => {
    setEditingId(owner.id);
    setFormData({
      name: owner.name,
      address: owner.address,
      phone: owner.phone,
      email: owner.email,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce propriétaire ?")) return;
    await deleteOwner(id);
    setOwners(owners.filter((o) => o.id !== id));
  };

  /* ========================
     RECHERCHE
  ======================== */
  const filteredOwners = owners.filter((o) => {
    if (!searchValue.trim()) return true;
    return (
      o.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      o.phone.includes(searchValue)
    );
  });

  /* ========================
     UI
  ======================== */
  return (
    <div style={{ padding: "20px" }}>
      <h2>Gestion des propriétaires</h2>

      {/* RECHERCHE */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nom ou téléphone"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            padding: "6px",
            width: "200px",
            marginRight: "10px",
          }}
        />

        <button
          style={{
            padding: "6px 12px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Rechercher
        </button>
      </div>

      {/* FORMULAIRE */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <h3>{editingId ? "Modifier un propriétaire" : "Ajouter un propriétaire"}</h3>

        {editingId && (
          <p>
            <strong>ID :</strong> {editingId}
          </p>
        )}

        {[
          { label: "Nom & Prénom", name: "name" },
          { label: "Adresse", name: "address" },
          { label: "Téléphone", name: "phone" },
          { label: "Email", name: "email" },
        ].map((field) => (
          <div key={field.name} style={{ marginBottom: "8px" }}>
            <strong>{field.label} :</strong>
            <br />
            <input
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
              style={{
                padding: "6px",
                width: "250px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        ))}

        <button
          type="submit"
          style={{
            padding: "6px 14px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            marginRight: "10px",
          }}
        >
          {editingId ? "Mettre à jour" : "Ajouter"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            style={{
              padding: "6px 14px",
              background: "#9ca3af",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Annuler
          </button>
        )}
      </form>

      {/* LISTE */}
      {filteredOwners.map((owner) => (
        <div
          key={owner.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
          }}
        >
          <p><strong>ID :</strong> {owner.id}</p>
          <p><strong>Nom :</strong> {owner.name}</p>
          <p><strong>Adresse :</strong> {owner.address}</p>
          <p><strong>Téléphone :</strong> {owner.phone}</p>
          <p><strong>Email :</strong> {owner.email}</p>

          <button
            onClick={() => handleEdit(owner)}
            style={{
              marginRight: "10px",
              padding: "5px 10px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Modifier
          </button>

          <button
            onClick={() => handleDelete(owner.id)}
            style={{
              padding: "5px 10px",
              background: "#dc2626",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}
