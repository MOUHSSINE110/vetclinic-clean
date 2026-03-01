import { useEffect, useState } from "react";
import { getAnimals, createAnimal, updateAnimal, deleteAnimal } from "../../api/animals.api";
import { getOwners } from "../../api/owners.api";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";

// --- STYLES ---

const Field = ({ label, children }) => (
  <div style={{ marginBottom: "10px" }}>
    <strong>{label} :</strong>
    <br />
    {children}
  </div>
);

const inputStyle = {
  padding: "6px",
  width: "100%",
  maxWidth: "280px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

const inputSearch = {
  padding: "6px",
  width: "100%",
  maxWidth: "300px",
  margin: "15px 0",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const formContainer = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  marginBottom: "25px",
};

const btnPrimary = {
  padding: "6px 14px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  marginRight: "10px",
  cursor: "pointer",
};

const btnCancel = {
  padding: "6px 14px",
  background: "#9ca3af",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

// --- STYLES TABLEAU ---
const tableContainer = {
  background: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  marginBottom: "25px",
  width: "100%",
  overflowX: "auto", // Scroll horizontal sur mobile
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "900px", // Largeur minimum pour la lisibilité
};

const thStyle = {
  textAlign: "left",
  padding: "12px 15px",
  backgroundColor: "#f3f4f6",
  color: "#374151",
  fontWeight: "bold",
  borderBottom: "2px solid #e5e7eb",
  fontSize: "14px",
};

const tdStyle = {
  padding: "12px 15px",
  borderBottom: "1px solid #e5e7eb",
  color: "#4b5563",
  fontSize: "14px",
  verticalAlign: "middle",
};

const actionBtn = {
  padding: "4px 8px",
  marginRight: "5px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "12px",
  color: "#fff",
};

const btnEdit = { ...actionBtn, background: "#2563eb" };
const btnDelete = { ...actionBtn, background: "#dc2626" };
const btnView = { ...actionBtn, background: "#10b981", border: "1px solid #10b981", color: "#fff" };

// ------------------------------------------------------------------

export default function AnimalsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ownerIdFilter = searchParams.get("ownerId");
  const animalIdFilter = searchParams.get("animalId");

  const [allAnimals, setAllAnimals] = useState([]); 
  const [owners, setOwners] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [dateError, setDateError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [formData, setFormData] = useState({
    name: "", species: "", race: "", dateNaissance: "", ownerId: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const allAnimalsData = await getAnimals();
        const ownersData = await getOwners();
        setAllAnimals(allAnimalsData);
        setOwners(ownersData);
      } catch (error) {
        console.error("Erreur de chargement:", error);
      }
    };
    loadData();
  }, []);

  // Reset de la pagination quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [ownerIdFilter, animalIdFilter, search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === "dateNaissance" && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) setDateError("La date de naissance ne peut pas être dans le futur !");
      else setDateError("");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", species: "", race: "", dateNaissance: "", ownerId: "" });
    setEditingId(null);
    setDateError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dateError) { alert(dateError); return; }
    try {
      if (editingId) {
        const updated = await updateAnimal(editingId, formData);
        setAllAnimals(allAnimals.map((a) => (a.id === editingId ? updated : a)));
      } else {
        const newAnimal = await createAnimal(formData);
        setAllAnimals([...allAnimals, newAnimal]);
      }
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (animal) => {
    setEditingId(animal.id);
    setFormData(animal);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet animal ?")) return;
    try {
      await deleteAnimal(id);
      setAllAnimals(allAnimals.filter((a) => a.id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  const ownerName = (id) => {
    const o = owners.find((x) => x.id === Number(id));
    return o ? `${o.firstName} ${o.lastName}` : "-";
  };

  // --- LOGIQUE : RECHERCHE + FILTRES ---
  const filteredAnimals = allAnimals.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchesOwner = ownerIdFilter ? a.ownerId == ownerIdFilter : true;
    const matchesAnimalId = animalIdFilter ? a.id == animalIdFilter : true;
    return matchesSearch && matchesOwner && matchesAnimalId;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAnimals = filteredAnimals.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>
      <h2>Gestion des animaux</h2>

      {/* Boutons de navigation contextuels */}
      {(ownerIdFilter || animalIdFilter) && (
        <div style={{ marginBottom: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {ownerIdFilter && (
            <button onClick={() => navigate("/owners")} style={{ padding: "5px 10px", background: "#10b981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              ← Retour aux propriétaires
            </button>
          )}
          {animalIdFilter && (
             <button onClick={() => navigate("/consultations")} style={{ padding: "5px 10px", background: "#f59e0b", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              ← Retour aux consultations
            </button>
          )}
          <button onClick={() => navigate("/animals")} style={{ padding: "5px 10px", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Voir tous les animaux
          </button>
        </div>
      )}

      <input 
        type="text" 
        placeholder="Recherche par nom" 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
        style={inputSearch} 
      />

      <form onSubmit={handleSubmit} style={formContainer}>
        <h3>{editingId ? "Modifier un animal" : "Ajouter un animal"}</h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Field label="Nom de l’animal">
              <input name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
            </Field>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Field label="Espèce">
                  <input name="species" value={formData.species} onChange={handleChange} required style={inputStyle} />
                </Field>
                <Field label="Race">
                  <input name="race" value={formData.race} onChange={handleChange} style={inputStyle} />
                </Field>
            </div>

            <Field label="Date de naissance">
              <input 
                type="date" 
                name="dateNaissance" 
                value={formData.dateNaissance} 
                onChange={handleChange} 
                required 
                style={{ ...inputStyle, borderColor: dateError ? "red" : "#ccc" }} 
              />
            </Field>
            {dateError && <div style={{ color: "red", fontSize: "0.9rem", marginTop: "-5px" }}>⚠️ {dateError}</div>}

            <Field label="Propriétaire">
              <select name="ownerId" value={formData.ownerId} onChange={handleChange} required style={inputStyle}>
                <option value="">-- Choisir --</option>
                {owners.map((o) => (<option key={o.id} value={o.id}>{o.firstName} {o.lastName}</option>))}
              </select>
            </Field>
        </div>

        <div style={{ marginTop: "15px" }}>
            <button type="submit" style={btnPrimary}>
                {editingId ? "Mettre à jour" : "Ajouter"}
            </button>
            {editingId && <button type="button" onClick={resetForm} style={btnCancel}>Annuler</button>}
        </div>
      </form>

      {filteredAnimals.length === 0 && <p style={{ textAlign: "center", color: "#666" }}>Aucun animal trouvé.</p>}

      {/* --- AFFICHAGE SOUS FORME DE TABLEAU --- */}
      {filteredAnimals.length > 0 && (
        <div style={tableContainer}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nom</th>
                <th style={thStyle}>Espèce</th>
                <th style={thStyle}>Race</th>
                <th style={thStyle}>Âge</th>
                <th style={thStyle}>Propriétaire</th>
                <th style={thStyle} width="200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAnimals.map((a) => (
                <tr key={a.id} style={{ backgroundColor: "#fff", transition: "background 0.2s" }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                >
                  <td style={tdStyle}>{a.name}</td>
                  <td style={tdStyle}>{a.species}</td>
                  <td style={tdStyle}>{a.race || "—"}</td>
                  <td style={tdStyle}>{a.age !== null && a.age !== undefined ? `${a.age} ans` : "—"}</td>
                  <td style={tdStyle}>{ownerName(a.ownerId)}</td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      <button onClick={() => handleEdit(a)} style={btnEdit}>Modifier</button>
                      <button onClick={() => handleDelete(a.id)} style={btnDelete}>Supprimer</button>
                      <button 
                          onClick={() => navigate(`/consultations?animalId=${a.id}`)} 
                          style={btnView}
                      >
                          Consultations
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredAnimals.length > itemsPerPage && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={filteredAnimals.length}
                paginate={paginate}
                currentPage={currentPage}
            />
        </div>
      )}
    </div>
  );
}