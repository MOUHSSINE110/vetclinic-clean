import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOwners, createOwner, deleteOwner, updateOwner } from "../../api/owners.api";
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
  color: "white",
  border: "none",
  display: "inline-flex",
  marginRight: "10px",
  borderRadius: "6px",
  cursor: "pointer",
  alignItems: "center",
};

const btnCancel = {
  padding: "6px 14px",
  background: "#9ca3af",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  marginRight: "10px",
  cursor: "pointer",
};

// Styles pour les petits boutons dans le tableau
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

// --- STYLES TABLEAU ---
const tableContainer = {
  background: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden", // Pour arrondir les coins
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  marginBottom: "25px",
  width: "100%",
  overflowX: "auto", // Scroll horizontal sur mobile
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "800px", // Force une largeur minimum pour la lisibilité
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

const trHoverStyle = {
  backgroundColor: "#f9fafb",
};

// ------------------------------------------------------------------

export default function OwnersPage() {
  const navigate = useNavigate();

  const [allOwners, setAllOwners] = useState([]); 
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  // États Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      const data = await getOwners();
      setAllOwners(data);
    } catch (error) {
      console.error("Erreur chargement propriétaires:", error);
      setAllOwners([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Nettoyage téléphone à la saisie
    if (name === 'phone') {
        const cleanValue = value.replace(/[^0-9]/g, '');
        setFormData({ ...formData, [name]: cleanValue });
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await updateOwner(editingId, formData);
        setAllOwners(allOwners.map((o) => (o.id === editingId ? updated : o)));
      } else {
        const newOwner = await createOwner(formData); 
        setAllOwners([...allOwners, newOwner]);
      }
      resetForm();
      loadOwners(); 
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'enregistrement.");
    }
  };

  const handleEdit = (owner) => {
    setEditingId(owner.id);
    setFormData({
      firstName: owner.firstName,
      lastName: owner.lastName,
      email: owner.email,
      address: owner.address,
      phone: owner.phone
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce propriétaire ?")) return;
    try {
      await deleteOwner(id);
      setAllOwners(allOwners.filter((o) => o.id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression.");
    }
  };

  // --- LOGIQUE : RECHERCHE ROBUSTE (Nom OU Téléphone) ---
  const filteredOwners = allOwners ? allOwners.filter((o) => {
    const searchLower = search.toLowerCase().trim();

    // 1. Recherche dans le Nom / Prénom
    const fullName = `${o.firstName} ${o.lastName}`.toLowerCase();
    if (fullName.includes(searchLower)) return true;

    // 2. Recherche dans le Téléphone (Nettoyage AGGRESSIF)
    const cleanPhoneDb = (o.phone || "").replace(/\D/g, ''); 
    const cleanSearch = search.replace(/\D/g, '');

    if (cleanPhoneDb && cleanSearch && cleanPhoneDb.includes(cleanSearch)) {
        return true;
    }

    return false;
  }) : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOwners = filteredOwners.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!allOwners) return <div style={{ padding: "20px" }}>Chargement des propriétaires...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}> {/* maxWidth augmenté pour le tableau */}
      <h2>Gestion des propriétaires</h2>

      <input
        type="text"
        placeholder="Rechercher par nom ou téléphone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={inputSearch}
      />

      <form onSubmit={handleSubmit} style={formContainer}>
        <h3>{editingId ? "Modifier un propriétaire" : "Nouveau Propriétaire"}</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Field label="Prénom">
                  <input name="firstName" value={formData.firstName} onChange={handleChange} required style={inputStyle} />
                </Field>
                <Field label="Nom">
                  <input name="lastName" value={formData.lastName} onChange={handleChange} required style={inputStyle} />
                </Field>
            </div>

            <Field label="Email">
              <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required style={inputStyle} />
            </Field>

            <Field label="Téléphone">
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
            </Field>

            <Field label="Adresse">
              <input type="text" name="address" value={formData.address} onChange={handleChange} style={inputStyle} />
            </Field>
        </div>

        <div style={{ marginTop: "15px" }}>
            <button type="submit" style={btnPrimary}>
            {editingId ? "Mettre à jour" : "Ajouter"}
            </button>

            {editingId && <button type="button" onClick={resetForm} style={btnCancel}>Annuler</button>}
        </div>
      </form>

      {/* --- AFFICHAGE SOUS FORME DE TABLEAU --- */}
      {filteredOwners.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>Aucun propriétaire trouvé.</p>
      ) : (
        <div style={tableContainer}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nom</th>
                <th style={thStyle}>Prénom</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Téléphone</th>
                <th style={thStyle}>Adresse</th>
                <th style={thStyle} width="200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOwners.map((owner) => (
                <tr key={owner.id} style={trHoverStyle}>
                  <td style={tdStyle}>{owner.lastName}</td>
                  <td style={tdStyle}>{owner.firstName}</td>
                  <td style={tdStyle}>{owner.email}</td>
                  <td style={tdStyle}>{owner.phone || "-"}</td>
                  <td style={tdStyle}>{owner.address || "-"}</td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      <button onClick={() => handleEdit(owner)} style={btnEdit}>Modifier</button>
                      <button onClick={() => handleDelete(owner.id)} style={btnDelete}>Supprimer</button>
                      <button 
                          onClick={() => navigate(`/animals?ownerId=${owner.id}`)} 
                          style={btnView}
                      >
                        Animaux
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredOwners.length > itemsPerPage && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
            <Pagination itemsPerPage={itemsPerPage} totalItems={filteredOwners.length} paginate={paginate} currentPage={currentPage} />
        </div>
      )}
    </div>
  );
}