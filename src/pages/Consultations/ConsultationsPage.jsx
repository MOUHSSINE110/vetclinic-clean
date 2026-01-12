import { useEffect, useState } from "react";
import {
  getConsultations,
  createConsultation,
  updateConsultation,
  deleteConsultation,
} from "../api/consultations.api";
import { getAnimals } from "../api/animals.api";

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    animalId: "",
    date: "",
    motif: "",
    notes: "",
  });

  /* ========================
     Chargement
     ======================== */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setConsultations(await getConsultations());
    setAnimals(await getAnimals());
  };

  /* ========================
     Formulaire
     ======================== */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      animalId: "",
      date: "",
      motif: "",
      notes: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.animalId) {
      alert("Veuillez choisir un animal");
      return;
    }

    if (editingId) {
      const updated = { id: editingId, ...formData };
      await updateConsultation(editingId, updated);
      setConsultations(
        consultations.map((c) => (c.id === editingId ? updated : c))
      );
    } else {
      const newConsultation = { id: Date.now(), ...formData };
      await createConsultation(newConsultation);
      setConsultations([...consultations, newConsultation]);
    }

    resetForm();
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setFormData(c);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette consultation ?")) return;
    await deleteConsultation(id);
    setConsultations(consultations.filter((c) => c.id !== id));
  };

  /* ========================
     Helpers
     ======================== */
  const animalName = (id) => {
    const a = animals.find((x) => x.id === Number(id));
    return a ? a.name : "-";
  };

  /* ========================
     UI
     ======================== */
  return (
    <div style={{ padding: "20px" }}>
      <h2>Gestion des consultations</h2>

      {/* FORMULAIRE */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "25px" }}>
        <h3>
          {editingId ? "Modifier une consultation" : "Ajouter une consultation"}
        </h3>

        <Field label="Animal">
          <select
            name="animalId"
            value={formData.animalId}
            onChange={handleChange}
            required
            style={input}
          >
            <option value="">-- Choisir --</option>
            {animals.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Date">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={input}
          />
        </Field>

        <Field label="Motif">
          <input
            name="motif"
            value={formData.motif}
            onChange={handleChange}
            required
            style={input}
          />
        </Field>

        <Field label="Notes">
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            required
            style={{ ...input, height: "60px" }}
          />
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
      {consultations.map((c) => (
        <div key={c.id} style={card}>
          <p><strong>ID :</strong> {c.id}</p>
          <p><strong>Animal :</strong> {animalName(c.animalId)}</p>
          <p><strong>Date :</strong> {c.date}</p>
          <p><strong>Motif :</strong> {c.motif}</p>
          <p><strong>Notes :</strong> {c.notes}</p>

          <button onClick={() => handleEdit(c)} style={btnEdit}>
            Modifier
          </button>
          <button onClick={() => handleDelete(c.id)} style={btnDelete}>
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}

/* ========================
   UI STYLES (identiques Animals)
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
