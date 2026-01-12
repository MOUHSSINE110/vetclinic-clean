import axios from "axios";

const API_URL = "http://localhost:3000/api/owners";

export const getOwners = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createOwner = async (owner) => {
  const response = await axios.post(API_URL, owner);
  return response.data;
};

export const updateOwner = async (id, owner) => {
  const response = await axios.put(`${API_URL}/${id}`, owner);
  return response.data;
};

export const deleteOwner = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
