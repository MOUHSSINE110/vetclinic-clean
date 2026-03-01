import api from "./axios";

// --- MAPPING : Base de données (Laravel) <---> React ---

const mapFromApi = (animal) => {
  // Calcul de l'âge à partir de la date de naissance
  let calculatedAge = null;
  if (animal.date_naissance) {
    const birthDate = new Date(animal.date_naissance);
    const today = new Date();
    
    // Calcul simple de la différence d'années
    let age = today.getFullYear() - birthDate.getFullYear();
    
    // Ajustement si l'anniversaire n'est pas encore passé cette année
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    calculatedAge = age;
  }

  return {
    id: animal.id,
    name: animal.nom,              // Laravel 'nom' -> React 'name'
    species: animal.espece,        // Laravel 'espece' -> React 'species'
    race: animal.race,             // Laravel 'race' -> React 'race'
    
    // On renvoie les DEUX informations :
    // 1. La date brute (pour le calendrier du formulaire)
    dateNaissance: animal.date_naissance,
    // 2. L'âge calculé (pour l'affichage dans la liste)
    age: calculatedAge,
    
    ownerId: animal.proprietaire_id,
  };
};

const mapToApi = (animal) => {
  return {
    nom: animal.name,
    espece: animal.species,
    race: animal.race,
    // On envoie la date (dateNaissance) vers la colonne date_naissance
    date_naissance: animal.dateNaissance,
    proprietaire_id: animal.ownerId,
  };
};

// --- FONCTIONS API ---

export const getAnimals = async () => {
  const response = await api.get("/animals");
  return response.data.map(mapFromApi);
};

export const getAnimal = async (id) => {
  const response = await api.get(`/animals/${id}`);
  return mapFromApi(response.data);
};

export const createAnimal = async (animal) => {
  const payload = mapToApi(animal);
  const response = await api.post("/animals", payload);
  return mapFromApi(response.data);
};

export const updateAnimal = async (id, animal) => {
  const payload = mapToApi(animal);
  const response = await api.put(`/animals/${id}`, payload);
  return mapFromApi(response.data);
};

export const deleteAnimal = async (id) => {
  await api.delete(`/animals/${id}`);
};