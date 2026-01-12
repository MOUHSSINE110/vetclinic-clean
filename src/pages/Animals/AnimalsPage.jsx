import { useEffect, useState } from "react";
import {
  getAnimals,
  createAnimal,
  updateAnimal,
  deleteAnimal,
} from "../api/animals.api";
import { getOwners } from "../api/owners.api";

export default function AnimalsPage() {
  const [animals, setAnimals] = useState([]);
  const [owners, setOwners] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    age: "",
    ownerId: "",
  });

  /* ========================
     Chargement
     ======================== */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setAnimals(await getAnimals());
    setOwners(await getOwners());
  };

  /* ========================
     Formulaire
     ======================== */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      species: "",
      age: "",
      ownerId: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      const updated = { id: editingId, ...formData };
      await updateAnimal(editingId, updated);
      setAnimals(animals.map((a) => (a.id === editingId ? updated : a)));
    } else {
      const newAnimal = { id: Date.now(), ...formData };
      await createAnimal(newAnimal);
      setAnimals([...animals, newAnimal]);
    }

    resetForm();
  };

  const handleEdit = (animal) => {
    setEditingId(animal.id);
    setFormData(animal);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet animal ?")) return;
    await deleteAnimal(id);
    setAnimals(animals.filter((a) => a.id !== id));
  };

  /* ========================
     Recherche
     ======================== */
  const filteredAnimals = animals.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const ownerName = (id) => {
    const o = owners.find((x) => x.id === Number(id));
    return o ? o.name : "-";
  };

  /* ========================
     UI
     ======================== */
  return (
    <div style={{ padding: "20px" }}>
      <h2>Gestion des animaux</h2>

      {/* RECHERCHE */}
      <input
        type="text"
        placeholder="Recherche par nom"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={inputSearch}
      />

      {/* FORMULAIRE */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "25px" }}>
        <h3>{editingId ? "Modifier un animal" : "Ajouter un animal"}</h3>

        <Field label="Nom de l’animal">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={input}
          />
        </Field>

        <Field label="Espèce">
          <input
            name="species"
            value={formData.species}
            onChange={handleChange}
            required
            style={input}
          />
        </Field>

        <Field label="Âge">
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            style={input}
          />
        </Field>

        <Field label="Propriétaire">
          <select
            name="ownerId"
            value={formData.ownerId}
            onChange={handleChange}
            required
            style={input}
          >
            <option value="">-- Choisir --</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </Field>

        <button type="submit" style={btnPrimary}>
          {editingId ? "Mettre à jour" : "Ajouter"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm} style={btnCancel}>
            Annuler
          </button>
        )}
      </form>

      {/* LISTE */}
      {filteredAnimals.map((a) => (
        <div key={a.id} style={card}>
          <p><strong>ID :</strong> {a.id}</p>
          <p><strong>Nom :</strong> {a.name}</p>
          <p><strong>Espèce :</strong> {a.species}</p>
          <p><strong>Âge :</strong> {a.age}</p>
          <p><strong>Propriétaire :</strong> {ownerName(a.ownerId)}</p>

          <button onClick={() => handleEdit(a)} style={btnEdit}>
            Modifier
          </button>
          <button onClick={() => handleDelete(a.id)} style={btnDelete}>
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}

/* ========================
   UI STYLES (identiques Owners)
   ======================== */

const Field = ({ label, children }) => (
  <div style={{ marginBottom: "10px" }}>
    <strong>{label} :</strong>
    <br />
    {children}
  </div>
);

const input = {
  padding: "6px",
  width: "280px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const inputSearch = {
  padding: "6px",
  width: "260px",
  margin: "15px 0",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const btnPrimary = {
  padding: "6px 14px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  marginRight: "10px",
};

const btnCancel = {
  padding: "6px 14px",
  background: "#9ca3af",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
};

const btnEdit = {
  padding: "5px 10px",
  marginRight: "8px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
};

const btnDelete = {
  padding: "5px 10px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
};

const card = {
  border: "1px solid #e5e7eb",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
};
