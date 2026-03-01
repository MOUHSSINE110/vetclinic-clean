import api from "../services/axios";

// Transformation Réponse (Laravel -> React)
const mapFromApi = (animal) => ({
  id: animal.id,
  name: animal.nom,           // nom -> name
  species: animal.espece,     // espece -> species
  breed: animal.race,         // race -> breed
  age: animal.date_naissance, // On garde la date ou on calcule l'âge ici si besoin
  ownerId: animal.proprietaire_id, // proprietaire_id -> ownerId
});

// Transformation Requête (React -> Laravel)
const mapToApi = (animal) => ({
  nom: animal.name,           // name -> nom
  espece: animal.species,     // species -> espece
  race: animal.breed,         // breed -> race
  date_naissance: animal.age, // Simplification: on envoie l'âge comme date si c'est un champ date
  proprietaire_id: animal.ownerId, // ownerId -> proprietaire_id
});

export const getAnimals = async () => {
  const response = await api.get("/animals");
  // On transforme la liste reçue pour que React comprenne
  return response.data.map(mapFromApi);
};

export const getAnimal = async (id) => {
  const response = await api.get(`/animals/${id}`);
  return mapFromApi(response.data);
};

export const createAnimal = async (animal) => {
  // On transforme les données avant d'envoyer
  const payload = mapToApi(animal);
  const response = await api.post("/animals", payload);
  return mapFromApi(response.data);
};

export const updateAnimal = async (id, animal) => {
  // On transforme les données avant d'envoyer
  const payload = mapToApi(animal);
  const response = await api.put(`/animals/${id}`, payload);
  return mapFromApi(response.data);
};

export const deleteAnimal = async (id) => {
  await api.delete(`/animals/${id}`);
};