import api from "./axios";

// --- MAPPING ---

// Réponse (Laravel -> React)
const mapFromApi = (owner) => ({
  id: owner.id,
  firstName: owner.prenom,      // Laravel 'prenom' -> React 'firstName'
  lastName: owner.nom,          // Laravel 'nom' -> React 'lastName'
  email: owner.email,
  phone: owner.telephone,
  address: owner.adresse
});

// Requête (React -> Laravel)
const mapToApi = (owner) => ({
  prenom: owner.firstName,      // React 'firstName' -> Laravel 'prenom'
  nom: owner.lastName,          // React 'lastName' -> Laravel 'nom'
  email: owner.email,
  telephone: owner.phone,
  adresse: owner.address
});

// --- FONCTIONS API ---

export const getOwners = async () => {
  const response = await api.get("/proprietaires");
  return response.data.map(mapFromApi);
};

export const getOwner = async (id) => {
  const response = await api.get(`/proprietaires/${id}`);
  return mapFromApi(response.data);
};

export const createOwner = async (owner) => {
  const payload = mapToApi(owner);
  const response = await api.post("/proprietaires", payload);
  return mapFromApi(response.data);
};

export const updateOwner = async (id, owner) => {
  const payload = mapToApi(owner);
  const response = await api.put(`/proprietaires/${id}`, payload);
  return mapFromApi(response.data);
};

export const deleteOwner = async (id) => {
  await api.delete(`/proprietaires/${id}`);
};