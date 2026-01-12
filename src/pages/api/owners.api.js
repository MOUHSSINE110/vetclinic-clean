let owners = [
  { id: 1, name: "Ahmed", phone: "0612345678" },
  { id: 2, name: "Fatima", phone: "0622334455" },
];

export const getOwners = async () => {
  return owners;
};

export const getOwnerById = async (id) => {
  return owners.find(o => o.id === Number(id));
};

export const createOwner = async (owner) => {
  owners.push({ id: Date.now(), ...owner });
};

export const updateOwner = async (id, data) => {
  owners = owners.map(o =>
    o.id === Number(id) ? { ...o, ...data } : o
  );
};

export const deleteOwner = async (id) => {
  owners = owners.filter(o => o.id !== Number(id));
};
