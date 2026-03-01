import api from "../../api/axios";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from "../../api/documents.api";
import { getConsultations } from "../../api/consultations.api";
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
  maxWidth: "400px",
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
  background: "#8b5cf6",
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
const btnView = { ...actionBtn, background: "#059669" };

// --- STYLES MODAL (VISUALISATION) ---
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  zIndex: 2000,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalBox = {
  backgroundColor: "white",
  width: "90%",
  maxWidth: "1000px",
  height: "90vh",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
  position: "relative",
};

const modalHeader = {
  padding: "15px 20px",
  borderBottom: "1px solid #ddd",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#f9fafb",
};

const modalContent = {
  flex: 1,
  backgroundColor: "#525659",
  position: "relative",
  overflow: "hidden",
};

const closeBtn = {
  background: "transparent",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
  color: "#666",
};

const FILE_BASE_URL = "http://127.0.0.1:8000";

// ------------------------------------------------------------------

export default function DocumentsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const consultationIdFilter = searchParams.get("consultationId");

  const [allDocuments, setAllDocuments] = useState([]); 
  const [consultations, setConsultations] = useState([]); 
  
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [formData, setFormData] = useState({
    file: null,
    consultationId: "",
  });

  // --- ETATS POUR LE MODAL ---
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewUrl, setViewUrl] = useState(null);
  const [viewName, setViewName] = useState("");

  useEffect(() => {
    loadData();
  }, [consultationIdFilter]);

  const loadData = async () => {
    try {
      const [docsData, consultsData] = await Promise.all([
        getDocuments(),
        getConsultations(),
      ]);
      setConsultations(consultsData);

      if (consultationIdFilter) {
        setFormData((prev) => ({ ...prev, consultationId: consultationIdFilter }));
        const filteredDocs = docsData.filter((d) => d.consultationId == consultationIdFilter);
        setAllDocuments(filteredDocs);
      } else {
        setAllDocuments(docsData);
      }
    } catch (error) {
      console.error("Erreur chargement documents:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFormData({ ...formData, file: selectedFile });
  };

  const handleConsultationChange = (e) => {
    setFormData({ ...formData, consultationId: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      file: null,
      consultationId: consultationIdFilter || "",
    });
    setEditingId(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file && !editingId) {
      alert("Veuillez choisir un fichier.");
      return;
    }
    
    if (!formData.consultationId || isNaN(formData.consultationId)) {
      alert("Veuillez choisir une consultation valide dans la liste.");
      return;
    }

    try {
      const payload = new FormData();
      if (formData.file) {
        payload.append('file', formData.file);
      }
      payload.append('consultation_id', Number(formData.consultationId));

      if (editingId) {
        await updateDocument(editingId, payload);
        alert("Document modifié avec succès");
      } else {
        await createDocument(payload);
        alert("Document ajouté avec succès");
      }
      
      resetForm();
      loadData(); 
    } catch (error) {
      console.error("Erreur complète:", error);
      let messageErreur = "Erreur inconnue";
      
      if (error.response) {
        const data = error.response.data;
        if (data.message) {
          messageErreur = data.message;
        } else if (data.error) {
          messageErreur = data.error;
        } else {
          messageErreur = JSON.stringify(data);
        }
      } else if (error.message) {
        messageErreur = error.message;
      }

      alert("Erreur Serveur :\n\n" + messageErreur);
    }
  };

  const handleEdit = (doc) => {
    setEditingId(doc.id);
    setFormData({
      file: null, 
      consultationId: doc.consultationId
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce document ?")) return;
    try {
      await deleteDocument(id);
      setAllDocuments(allDocuments.filter((d) => d.id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression.");
    }
  };

  // --- LOGIQUE VISUALISATION POPUP ---
  const handleView = async (doc) => {
    try {
      // Récupération du fichier en Blob pour éviter le téléchargement
      const response = await api.get(`/documents/download/${doc.id}`, {
        responseType: 'blob'
      });
      
      const fileURL = URL.createObjectURL(response.data);
      setViewUrl(fileURL);
      setViewName(doc.name);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ouverture du fichier.");
    }
  };

  const closeViewModal = () => {
    if (viewUrl) {
      URL.revokeObjectURL(viewUrl); // Libérer la mémoire
    }
    setIsViewModalOpen(false);
    setViewUrl(null);
  };

  // Recherche
  const filteredDocuments = allDocuments.filter((d) => {
    const nameToCheck = d.name || ""; 
    return nameToCheck.toLowerCase().includes(search.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocuments = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>
      
      <h2>Gestion des Documents</h2>

      {consultationIdFilter && (
        <button
          onClick={() => navigate("/consultations")}
          style={{
            marginBottom: "15px",
            padding: "5px 10px",
            background: "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ← Retour aux consultations
        </button>
      )}

      <input
        type="text"
        placeholder="Rechercher un document..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={inputSearch}
      />

      <form onSubmit={handleSubmit} style={formContainer}>
        <h3>{editingId ? "Modifier un document" : "Ajouter un document"}</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Field label="Consultation liée *">
            <select
                value={formData.consultationId}
                onChange={handleConsultationChange}
                required
                disabled={!!consultationIdFilter} 
                style={inputStyle}
            >
                <option value="">-- Choisir une consultation --</option>
                {consultations.map((c) => (
                <option key={c.id} value={c.id}>
                    {c.dateConsultation || c.date} - {c.motif || c.description || "Sans motif"}
                </option>
                ))}
            </select>
            </Field>

            <Field label="Fichier (PDF) *">
            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required={!editingId}
                style={inputStyle}
            />
            {editingId && <small style={{color: "#666"}}>Laissez vide pour conserver le fichier actuel.</small>}
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

      {filteredDocuments.length === 0 && <p style={{ textAlign: "center", color: "#666" }}>Aucun document trouvé.</p>}

      {/* --- AFFICHAGE SOUS FORME DE TABLEAU --- */}
      {filteredDocuments.length > 0 && (
        <div style={tableContainer}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nom</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Consultation ID</th>
                <th style={thStyle}>Date d'ajout</th>
                <th style={thStyle} width="280">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentDocuments.map((d) => {
                return (
                  <tr key={d.id} style={{ backgroundColor: "#fff", transition: "background 0.2s" }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                  >
                    <td style={tdStyle}>{d.name}</td>
                    <td style={tdStyle}>{d.name?.endsWith('.pdf') ? 'PDF' : 'Autre'}</td>
                    <td style={tdStyle}>{d.consultationId}</td>
                    <td style={tdStyle}>{d.uploadDate ? new Date(d.uploadDate).toLocaleDateString('fr-FR') : '-'}</td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {/* BOUTON VISUALISATION POPUP */}
                        <button 
                            onClick={() => handleView(d)}
                            style={btnView}
                        >
                            👁️ Voir
                        </button>

                        <button onClick={() => handleEdit(d)} style={btnEdit}>
                            Modifier
                        </button>
                        <button onClick={() => handleDelete(d.id)} style={btnDelete}>
                            Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filteredDocuments.length > itemsPerPage && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
            <Pagination itemsPerPage={itemsPerPage} totalItems={filteredDocuments.length} paginate={paginate} currentPage={currentPage} />
        </div>
      )}

      {/* --- MODAL VISUALISATION --- */}
      {isViewModalOpen && (
        <div style={modalOverlay} onClick={closeViewModal}>
          <div style={modalBox} onClick={(e) => e.stopPropagation()}>
            
            {/* En-tête du modal */}
            <div style={modalHeader}>
              <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                Visualisation : {viewName}
              </div>
              
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                {/* Lien de téléchargement réel à l'intérieur de la popup */}
                <a 
                  href={viewUrl} 
                  download={viewName} 
                  style={{ color: "#2563eb", textDecoration: "underline", cursor: "pointer", fontSize: "14px" }}
                >
                  Télécharger
                </a>
                <button style={closeBtn} onClick={closeViewModal}>✕</button>
              </div>
            </div>

            {/* Contenu PDF */}
            <div style={modalContent}>
                {viewUrl ? (
                    <iframe 
                    src={viewUrl} 
                    style={{ width: "100%", height: "100%", border: "none" }} 
                    title="Document Preview"
                    />
                ) : (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#aaa" }}>
                        Chargement...
                    </div>
                )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}