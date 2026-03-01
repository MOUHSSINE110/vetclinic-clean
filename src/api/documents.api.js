import api from "./axios";

// --- MAPPING (Correspondance Base de Données -> Frontend) ---

const mapFromApi = (document) => {
  return {
    id: document.id,
    // BDD : 'nom_fichier'  -->  React : 'name'
    name: document.nom_fichier, 
    // BDD : 'chemin'       -->  React : 'path'
    path: document.chemin, 
    // BDD : 'date_upload'  -->  React : 'uploadDate'
    uploadDate: document.date_upload,
    consultationId: document.consultation_id,
  };
};

// --- FONCTIONS API ---

export const getDocuments = async () => {
  const response = await api.get("/documents");
  return response.data.map(mapFromApi);
};

export const createDocument = async (data) => {
  const response = await api.post("/documents", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return mapFromApi(response.data);
};

export const updateDocument = async (id, data) => {
  data.append("_method", "PUT"); 

  const response = await api.post(`/documents/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return mapFromApi(response.data);
};

export const deleteDocument = async (id) => {
  await api.delete(`/documents/${id}`);
};