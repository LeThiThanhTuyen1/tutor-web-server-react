export const validateEmail = (email: string) => {
  if (!email) return "Email is required!";
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) ? null : "Invalid Email!";
};

export const validatePhone = (phone: string) => {
  if (!phone) return "Phone number is required!";
  const phoneRegex = /^(?:\+?\d{1,3}[-.\s]?)?\d{10,}$/;
  return phoneRegex.test(phone) ? null : "Invalid Phone number!";
};

export const validatePassword = (password: string) => {
  if (!password) return "Password is required!";
  return password.length >= 10 ? null : "Password must be at least 10 characters!";
};

export const validateConfirmPassword = (password: string, confirmPassword: string) => {
  if (!confirmPassword) return "Please re-enter password!";
  return password === confirmPassword ? null : "Confirmation password does not match!";
};

export const validateDateOfBirth = (dateOfBirth: Date) => {
  if (!dateOfBirth) return "Date of Birth is required!";
  const selectedDate = new Date(dateOfBirth);
  const today = new Date();
  return selectedDate < today ? null : "Invalid Date!";
};
export const validateUsername = (username: string) => {
  if (!username) return "Username is required!";
  return username.length >= 3 ? null : "Username must be at least 3 characters!";
};

export const validateAddress = (address: string) => {
  if (!address) return "Address is required!";
  return address.length >= 5 ? null : "Address must be at least 5 characters!";
};

export const validateRole = (role: string) => {
  const validRoles = ["student", "tutor", "admin"];
  return validRoles.includes(role) ? null : "Invalid role!";
};
