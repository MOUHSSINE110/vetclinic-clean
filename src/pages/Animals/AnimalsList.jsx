import { useEffect, useState } from "react";
import {
  getAnimals,
  createAnimal,
  updateAnimal,
  deleteAnimal,
} from "../../api/animals.api";
import { getOwners } from "../../api/owners.api";
import { useNavigate } from "react-router-dom";

<button
  className="btn btn-info"
  onClick={() => navigate(`/animals/${animal.id}/consultations`)}
>
  Consultations
</button>

export default function AnimalsList() {
  const [animals, setAnimals] = useState([]);
  const [owners, setOwners] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    ownerId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setAnimals(await getAnimals());
    setOwners(await getOwners());
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      species: "",
      breed: "",
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
      const newAnimal = {
        id: Date.now(),
        ...formData,
      };
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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gestion des animaux</h2>

      {/* FORMULAIRE */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "25px" }}>
        <h3>{editingId ? "Modifier un animal" : "Ajouter un animal"}</h3>

        {[
          { label: "Nom", name: "name" },
          { label: "Espèce", name: "species" },
          { label: "Race", name: "breed" },
          { label: "Âge", name: "age" },
        ].map((field) => (
          <div key={field.name} style={{ marginBottom: "10px" }}>
            <strong>{field.label} :</strong>
            <br />
            <input
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
              style={{ width: "260px", padding: "6px" }}
            />
          </div>
        ))}

        {/* PROPRIÉTAIRE */}
        <div style={{ marginBottom: "10px" }}>
          <strong>Propriétaire :</strong>
          <br />
          <select
            name="ownerId"
            value={formData.ownerId}
            onChange={handleChange}
            required
            style={{ width: "270px", padding: "6px" }}
          >
            <option value="">-- Choisir un propriétaire --</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

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
          <button type="button" onClick={resetForm}>
            Annuler
          </button>
        )}
      </form>

      {/* LISTE */}
      {animals.map((animal) => (
        <div
          key={animal.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
          }}
        >
          <p><strong>Nom :</strong> {animal.name}</p>
          <p><strong>Espèce :</strong> {animal.species}</p>
          <p><strong>Race :</strong> {animal.breed}</p>
          <p><strong>Âge :</strong> {animal.age}</p>
          <p>
            <strong>Propriétaire :</strong>{" "}
            {owners.find((o) => o.id == animal.ownerId)?.name || "—"}
          </p>

          <button onClick={() => handleEdit(animal)}>Modifier</button>
          <button
            onClick={() => handleDelete(animal.id)}
            style={{ marginLeft: "10px", color: "red" }}
          >
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}
