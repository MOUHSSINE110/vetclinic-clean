// ===============================
// MOCK DATA (mémoire)
// ===============================
let consultations = [
  {
    id: 1,
    animalId: 1,
    date: "2025-01-10",
    motif: "Vaccination",
    notes: "RAS",
  },
];

// ===============================
// API MOCK (SANS AXIOS)
// ===============================
export const getConsultations = async () => {
  return consultations;
};

export const createConsultation = async (consultation) => {
  consultations.push(consultation);
};

export const updateConsultation = async (id, updated) => {
  consultations = consultations.map((c) =>
    c.id === id ? updated : c
  );
};

export const deleteConsultation = async (id) => {
  consultations = consultations.filter((c) => c.id !== id);
};
