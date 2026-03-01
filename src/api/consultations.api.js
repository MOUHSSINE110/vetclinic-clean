import api from "./axios";

// --- MAPPING : Base de données (Laravel) <---> React ---

// Réponse API (Laravel) -> Objet React
const mapFromApi = (consultation) => {
  return {
    id: consultation.id,
    animalId: consultation.animal_id,       // DB: animal_id
    dateConsultation: consultation.date_cons, // DB: date_cons (ATTENTION: pas date_consultation)
    motif: consultation.motif,
    diagnostic: consultation.diagnostic,
    cost: consultation.cout,                  // DB: cout
    // user_id est géré par le middleware Sanctum coté serveur
  };
};

// Objet React -> Payload pour l'API (Laravel)
const mapToApi = (consultation) => {
  return {
    animal_id: consultation.animalId,
    date_cons: consultation.dateConsultation, // DB: date_cons
    motif: consultation.motif,
    diagnostic: consultation.diagnostic,
    cout: consultation.cost,                  // DB: cout
  };
};

// --- FONCTIONS API ---

export const getConsultations = async () => {
  const response = await api.get("/consultations");
  return response.data.map(mapFromApi);
};

export const getConsultation = async (id) => {
  const response = await api.get(`/consultations/${id}`);
  return mapFromApi(response.data);
};

export const createConsultation = async (consultation) => {
  const payload = mapToApi(consultation);
  const response = await api.post("/consultations", payload);
  return mapFromApi(response.data);
};

export const updateConsultation = async (id, consultation) => {
  const payload = mapToApi(consultation);
  const response = await api.put(`/consultations/${id}`, payload);
  return mapFromApi(response.data);
};

export const deleteConsultation = async (id) => {
  await api.delete(`/consultations/${id}`);
};