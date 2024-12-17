export const validateEmail = (email: string): boolean => {
  const pattern = /\S+@\S+\.\S+/;
  return pattern.test(email);
};

export const validatePassword = (password: string): boolean => {
  const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return pattern.test(password);
};
