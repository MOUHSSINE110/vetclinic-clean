let animals = [
  { id: 1, name: "Rex", ownerId: 1 },
  { id: 2, name: "Mimi", ownerId: 2 },
  { id: 3, name: "Bella", ownerId: 1 }
];

export const getAnimals = async () => {
  return Promise.resolve(animals);
};




export const createAnimal = async (animal) => {
  animals.push(animal);
  return Promise.resolve(animal);
};

export const updateAnimal = async (id, updatedAnimal) => {
  animals = animals.map((a) => (a.id === id ? updatedAnimal : a));
  return Promise.resolve(updatedAnimal);
};

export const deleteAnimal = async (id) => {
  animals = animals.filter((a) => a.id !== id);
  return Promise.resolve();
};
