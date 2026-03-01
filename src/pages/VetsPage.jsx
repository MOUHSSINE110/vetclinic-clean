import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/users.api";

// --- STYLES ---
const inputStyle = {
  padding: "6px",
  width: "100%",
  maxWidth: "280px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
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
  display: "none", // Caché par défaut, affiché seulement si on modifie
};

const btnDelete = {
  padding: "4px 8px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "12px",
  marginRight: "5px",
};

const btnEdit = {
  ...btnDelete,
  background: "#2563eb",
};

// --- STYLES TABLEAU ---
const tableContainer = {
  background: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  marginBottom: "25px",
  width: "100%",
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "600px",
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

const Field = ({ label, children }) => (
  <div style={{ marginBottom: "10px" }}>
    <strong>{label} :</strong>
    <br />
    {children}
  </div>
);

// ------------------------------------------------------------------

export default function VetsPage() {
  const [allVets, setAllVets] = useState([]);
  
  // État pour gérer l'édition
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    loadVets();
  }, []);

  const loadVets = async () => {
    try {
      const data = await getUsers();
      setAllVets(data);
    } catch (error) {
      console.error("Erreur chargement vétérinaires:", error);
      if (error.response?.status === 403) {
        alert("Accès refusé.");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Préparer le formulaire pour l'édition
  const handleEdit = (vet) => {
    setEditingId(vet.id);
    setFormData({
      name: vet.name,
      email: vet.email,
      password: "", // On ne remplit pas le mot de passe par sécurité
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Création ou Mise à jour selon qu'on a un ID d'édition ou non
      if (editingId) {
        // Pour la modification, on envoie le mot de passe SEULEMENT s'il est rempli
        const dataToSend = { ...formData };
        if (!dataToSend.password) {
            delete dataToSend.password;
        }
        await updateUser(editingId, dataToSend);
        alert("Vétérinaire modifié avec succès !");
      } else {
        // Pour la création, le mot de passe est obligatoire
        await createUser(formData);
        alert("Vétérinaire ajouté avec succès !");
      }
      
      resetForm();
      loadVets();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'opération.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce vétérinaire ?")) return;
    try {
      await deleteUser(id);
      setAllVets(allVets.filter((v) => v.id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>Gestion des Vétérinaires</h2>
      
      <form onSubmit={handleSubmit} style={formContainer}>
        <h3>{editingId ? "Modifier un vétérinaire" : "Nouveau Vétérinaire"}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
            <Field label="Nom complet">
              <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  style={inputStyle} 
                  placeholder="Ex: Dr. Dupont"
              />
            </Field>

            <Field label="Email (Login)">
              <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  style={inputStyle} 
                  placeholder="email@exemple.com"
              />
            </Field>

            <Field label={editingId ? "Mot de passe (Laisser vide pour garder l'actuel)" : "Mot de passe"}>
              <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required={!editingId} // Requis seulement si on crée
                  style={inputStyle} 
                  placeholder={editingId ? "Nouveau mot de passe" : "******"}
              />
            </Field>
            
            <div style={{ marginTop: "10px" }}>
                <button type="submit" style={{ ...btnPrimary, width: "fit-content" }}>
                    {editingId ? "Mettre à jour" : "Ajouter le vétérinaire"}
                </button>
                {editingId && (
                    <button type="button" onClick={resetForm} style={{...btnCancel, display: "inline-block"}}>
                        Annuler
                    </button>
                )}
            </div>
        </div>
      </form>

      {/* --- LISTE DES VÉTÉRINAIRES --- */}
      {allVets.length > 0 && (
        <div style={tableContainer}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nom</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Date de création</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allVets.map((vet) => (
                <tr key={vet.id} style={{ backgroundColor: "#fff" }}>
                  <td style={tdStyle}>{vet.name}</td>
                  <td style={tdStyle}>{vet.email}</td>
                  <td style={tdStyle}>{new Date(vet.created_at).toLocaleDateString('fr-FR')}</td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "5px" }}>
                        <button onClick={() => handleEdit(vet)} style={btnEdit}>
                            Modifier
                        </button>
                        <button onClick={() => handleDelete(vet.id)} style={btnDelete}>
                            Supprimer
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}