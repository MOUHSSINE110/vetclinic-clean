import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getConsultations,
  createConsultation,
  updateConsultation,
  deleteConsultation,
} from "../../api/consultations.api";
import { getAnimals } from "../../api/animals.api";
import { getOwners } from "../../api/owners.api";
import { getDocuments } from "../../api/documents.api";
import api from "../../api/axios";
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
  padding: "8px",
  width: "100%",
  maxWidth: "300px",
  margin: "0 0 20px 0",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const textArea = {
  padding: "6px",
  width: "100%",
  maxWidth: "400px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  minHeight: "80px",
  boxSizing: "border-box",
  fontFamily: "inherit",
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
  background: "#f59e0b",
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
  minWidth: "900px", 
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
const btnNav = { ...actionBtn, background: "#fff", color: "#2563eb", border: "1px solid #2563eb" };
const btnDoc = { ...actionBtn, background: "#fff", color: "#8b5cf6", border: "1px solid #8b5cf6" };

// --- STYLES MODAL ---
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  zIndex: 2000,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalBox = {
  backgroundColor: "white",
  width: "90%",
  maxWidth: "1100px",
  height: "90vh",
  borderRadius: "8px",
  display: "flex",
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
  flexDirection: "row",
};

const modalSidebar = {
  width: "300px",
  borderRight: "1px solid #e5e7eb",
  backgroundColor: "#f3f4f6",
  display: "flex",
  flexDirection: "column",
  flexShrink: 0,
};

const modalContent = {
  width: "100%",
  padding: "0",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#525659",
  position: "relative",
};

const docItem = {
  padding: "12px 15px",
  borderBottom: "1px solid #e5e7eb",
  cursor: "pointer",
  fontSize: "14px",
  transition: "background 0.2s",
  display: "flex",
  alignItems: "center",
  gap: "10px"
};

const docItemActive = {
  ...docItem,
  backgroundColor: "#fff",
  borderLeft: "4px solid #8b5cf6",
  fontWeight: "bold",
  color: "#4b5563"
};

const closeBtn = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "rgba(0,0,0,0.5)",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: "30px",
  height: "30px",
  cursor: "pointer",
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "16px"
};

// ------------------------------------------------------------------

export default function ConsultationsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const animalIdFilter = searchParams.get("animalId");

  const [allConsultations, setAllConsultations] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [owners, setOwners] = useState([]); 
  
  const [editingId, setEditingId] = useState(null);
  const [dateError, setDateError] = useState("");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [formData, setFormData] = useState({
    animalId: animalIdFilter || "",
    ownerIdFilter: "", 
    dateConsultation: "",
    motif: "",
    diagnostic: "",
    cost: "",
  });

  // --- ETATS POUR LE MODAL ---
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [modalDocs, setModalDocs] = useState([]); 
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState(null);
  const [currentDocName, setCurrentDocName] = useState("");

  useEffect(() => {
    loadData();
    if (animalIdFilter) {
      setFormData(prev => ({ ...prev, animalId: animalIdFilter }));
    }
  }, [animalIdFilter]);

  const loadData = async () => {
    try {
      const [ownersData, animalsData, consultationsData] = await Promise.all([
        getOwners(),
        getAnimals(),
        getConsultations()
      ]);
      setOwners(ownersData);
      setAnimals(animalsData);
      setAllConsultations(consultationsData);
    } catch (error) {
      console.error("Erreur chargement consultations:", error);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [animalIdFilter, search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "ownerIdFilter") {
      setFormData(prev => ({ ...prev, animalId: "" }));
    }

    if (name === "dateConsultation" && value) {
      const todayString = new Date().toLocaleDateString('en-CA'); 
      if (value > todayString) {
        setDateError("La date ne peut pas être dans le futur !");
      } else {
        setDateError("");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      animalId: animalIdFilter || "",
      ownerIdFilter: "",
      dateConsultation: "",
      motif: "",
      diagnostic: "",
      cost: "",
    });
    setEditingId(null);
    setDateError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dateError) {
      alert(dateError);
      return;
    }

    if (!formData.animalId) {
      alert("Veuillez choisir un animal.");
      return;
    }

    const payload = { ...formData };
    delete payload.ownerIdFilter;

    try {
      if (editingId) {
        const updated = await updateConsultation(editingId, payload);
        setAllConsultations(
          allConsultations.map((c) => (c.id === editingId ? updated : c))
        );
      } else {
        const newConsultation = await createConsultation(payload);
        setAllConsultations([...allConsultations, newConsultation]);
      }
      resetForm();
      loadData(); 
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement.");
    }
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    const animal = animals.find(a => a.id === c.animalId);
    setFormData({
      ...c,
      ownerIdFilter: animal ? animal.ownerId : "",
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette consultation ?")) return;
    try {
      await deleteConsultation(id);
      setAllConsultations(allConsultations.filter((c) => c.id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression.");
    }
  };

  const animalName = (id) => {
    const a = animals.find((x) => x.id === Number(id));
    return a ? `${a.name} (${a.species || ''})` : "Animal inconnu";
  };

  // --- LOGIQUE VISUALISATION POPUP ---
  const openDocModal = async (consultationId) => {
    try {
      const allDocs = await getDocuments();
      const filtered = allDocs.filter(d => d.consultationId == consultationId);
      setModalDocs(filtered);
      setIsDocModalOpen(true);

      if (filtered.length > 0) {
        loadAndPreview(filtered[0]);
      } else {
        setCurrentPreviewUrl(null);
        setCurrentDocName("");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Impossible de charger les documents.");
    }
  };

  const loadAndPreview = async (doc) => {
    try {
      const response = await api.get(`/documents/download/${doc.id}`, {
        responseType: 'blob'
      });
      const fileURL = URL.createObjectURL(response.data);
      setCurrentPreviewUrl(fileURL);
      setCurrentDocName(doc.name);
    } catch (error) {
      console.error("Erreur preview:", error);
      alert("Erreur lors du chargement du fichier.");
    }
  };

  const closeModal = () => {
    if (currentPreviewUrl) {
      URL.revokeObjectURL(currentPreviewUrl);
    }
    setIsDocModalOpen(false);
    setCurrentPreviewUrl(null);
  };

  // --- LOGIQUE : RECHERCHE + FILTRE ANIMAL + PAGINATION ---
  const filteredConsultations = allConsultations.filter((c) => {
    const matchesSearch = animalName(c.animalId).toLowerCase().includes(search.toLowerCase());
    const matchesAnimal = animalIdFilter ? c.animalId == animalIdFilter : true;
    return matchesSearch && matchesAnimal;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentConsultations = filteredConsultations.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredAnimals = formData.ownerIdFilter
    ? animals.filter(a => a.ownerId == formData.ownerIdFilter)
    : animals;

  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>
      <h2>Gestion des consultations</h2>

      {/* Boutons de navigation contextuels */}
      {animalIdFilter && (
        <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
            <button onClick={() => navigate("/animals")} style={{ padding: "5px 10px", background: "#10b981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                ← Retour aux animaux
            </button>
            <button onClick={() => navigate("/consultations")} style={{ padding: "5px 10px", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                Voir toutes les consultations
            </button>
        </div>
      )}

      <input
        type="text"
        placeholder="Rechercher un animal..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={inputSearch}
      />

      <form onSubmit={handleSubmit} style={formContainer}>
        <h3>
          {editingId ? "Modifier une consultation" : "Ajouter une consultation"}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Field label="Propriétaire (Filtre)">
                <select
                    name="ownerIdFilter"
                    value={formData.ownerIdFilter}
                    onChange={handleChange}
                    style={inputStyle}
                >
                    <option value="">-- Tous les propriétaires --</option>
                    {owners.map((o) => (
                    <option key={o.id} value={o.id}>
                        {o.firstName} {o.lastName}
                    </option>
                    ))}
                </select>
                </Field>

                <Field label="Animal *">
                <select
                    name="animalId"
                    value={formData.animalId}
                    onChange={handleChange}
                    required
                    disabled={!formData.ownerIdFilter && animals.length > 50} 
                    style={inputStyle}
                >
                    <option value="">-- Choisir un animal --</option>
                    {filteredAnimals.map((a) => (
                    <option key={a.id} value={a.id}>
                        {a.name} ({a.species})
                    </option>
                    ))}
                </select>
                </Field>
            </div>

            <Field label="Date consultation">
              <input
                type="date"
                name="dateConsultation"
                value={formData.dateConsultation}
                onChange={handleChange}
                required
                style={{ ...inputStyle, borderColor: dateError ? "red" : "#ccc" }}
              />
            </Field>
            {dateError && <div style={{color:"red", fontSize:"0.85rem", marginTop: "-5px"}}>{dateError}</div>}

            <Field label="Motif">
              <input
                name="motif"
                value={formData.motif}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </Field>

            <Field label="Diagnostic">
              <textarea
                name="diagnostic"
                value={formData.diagnostic}
                onChange={handleChange}
                required
                style={textArea}
              />
            </Field>

            <Field label="Coût (MAD)">
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                style={inputStyle}
              />
            </Field>
        </div>

        <div style={{ marginTop: "15px" }}>
            <button type="submit" style={btnPrimary}>
                {editingId ? "Mettre à jour" : "Ajouter"}
            </button>
            {editingId && (
                <button type="button" onClick={resetForm} style={btnCancel}>
                Annuler
                </button>
            )}
        </div>
      </form>

      {filteredConsultations.length === 0 && <p style={{ textAlign: "center", color: "#666" }}>Aucune consultation trouvée.</p>}

      {/* --- AFFICHAGE SOUS FORME DE TABLEAU --- */}
      {filteredConsultations.length > 0 && (
        <div style={tableContainer}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Animal</th>
                <th style={thStyle}>Motif</th>
                <th style={thStyle}>Coût</th>
                <th style={thStyle} width="280">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentConsultations.map((c) => (
                <tr key={c.id} style={{ backgroundColor: "#fff", transition: "background 0.2s" }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                >
                  <td style={tdStyle}>{c.dateConsultation}</td>
                  <td style={tdStyle}>{animalName(c.animalId)}</td>
                  <td style={tdStyle}>{c.motif}</td>
                  <td style={tdStyle}>{c.cost} MAD</td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      <button onClick={() => handleEdit(c)} style={btnEdit}>Modifier</button>
                      <button onClick={() => handleDelete(c.id)} style={btnDelete}>Supprimer</button>
                      
                      <button 
                          onClick={() => navigate(`/animals?animalId=${c.animalId}`)} 
                          style={btnNav}
                      >
                          Animal
                      </button>

                      <button
                          onClick={() => openDocModal(c.id)}
                          style={btnDoc}
                      >
                          Docs
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredConsultations.length > itemsPerPage && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
            <Pagination 
                itemsPerPage={itemsPerPage} 
                totalItems={filteredConsultations.length} 
                paginate={paginate} 
                currentPage={currentPage} 
            />
        </div>
      )}

      {/* --- MODAL VISUALISATION --- */}
      {isDocModalOpen && (
        <div style={modalOverlay} onClick={closeModal}>
          <div style={modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={modalSidebar}>
              <div style={{ padding: "15px", borderBottom: "1px solid #ddd", fontWeight: "bold", color: "#374151" }}>
                Documents associés
              </div>
              <div style={{ overflowY: "auto", flex: 1 }}>
                {modalDocs.length === 0 && (
                    <div style={{ padding: "20px", textAlign: "center", color: "#6b7280", fontSize: "14px" }}>
                        Aucun document pour cette consultation.
                    </div>
                )}
                {modalDocs.map((doc) => (
                  <div 
                    key={doc.id} 
                    style={currentDocName === doc.name ? docItemActive : docItem} 
                    onClick={() => loadAndPreview(doc)}
                  >
                    <span>📄</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {doc.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div style={modalContent}>
                <button style={closeBtn} onClick={closeModal} title="Fermer">✕</button>
                {currentPreviewUrl ? (
                    <iframe 
                    src={currentPreviewUrl} 
                    style={{ width: "100%", height: "100%", border: "none" }} 
                    title={`Aperçu : ${currentDocName}`}
                    />
                ) : (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#9ca3af", flexDirection: "column" }}>
                        <div style={{ fontSize: "40px", marginBottom: "10px" }}>📂</div>
                        <div>Aucun fichier à afficher</div>
                    </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}