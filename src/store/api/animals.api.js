import axios from "axios";

const API_URL = "http://localhost:3000/api/animals";

export const getAnimals = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createAnimal = async (animal) => {
  const res = await axios.post(API_URL, animal);
  return res.data;
};

export const updateAnimal = async (id, animal) => {
  const res = await axios.put(`${API_URL}/${id}`, animal);
  return res.data;
};

export const deleteAnimal = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
