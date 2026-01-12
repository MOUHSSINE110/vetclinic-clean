import api from "./api";

export const getOwners = async () => {
  const res = await api.get("/owners");
  return res.data;
};

export const createOwner = async (owner) => {
  const res = await api.post("/owners", owner);
  return res.data;
};

export const updateOwner = async (id, owner) => {
  const res = await api.put(`/owners/${id}`, owner);
  return res.data;
};

export const deleteOwner = async (id) => {
  await api.delete(`/owners/${id}`);
};
