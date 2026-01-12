export const login = (email, password) => {
  const user = { email };
  localStorage.setItem("user", JSON.stringify(user));
  return user;
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("user");
};
