export const validateEmail = (email: string) => {
  if (!email) return "Email không được để trống!";
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) ? null : "Email không hợp lệ!";
};

export const validatePhone = (phone: string) => {
  if (!phone) return "Phone number không được để trống!";
  const trimmedPhone = phone.trim();
  if (!trimmedPhone) return "Phone number không được để trống!";

  const phoneRegex = /^0[-\s.]?[0-9]{3}[-\s.]?[0-9]{3}[-\s.]?[0-9]{3}$/;

  if (!phoneRegex.test(trimmedPhone)) {
    const digitCount = trimmedPhone.replace(/[^\d]/g, "").length;
    if (digitCount !== 10) {
      return "Số điện thoại phải chứa 10 chữ số!";
    }
    return "Số điện thoại không đúng định dạng!";
  }

  return null;
};

export const validatePassword = (password: string) => {
  if (!password) return "Mật khẩu không được để trống!";
  return password.length >= 10 ? null : "Mật khẩu phải chứa ít nhất 10 ký tự!";
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
) => {
  if (!confirmPassword) return "Please re-enter password!";
  return password === confirmPassword
    ? null
    : "Confirmation password does not match!";
};

export const validateDateOfBirth = (dateOfBirth: Date) => {
  if (!dateOfBirth) return "Date of Birth is required!";
  const selectedDate = new Date(dateOfBirth);
  const today = new Date();
  return selectedDate < today ? null : "Invalid Date!";
};
export const validateUsername = (username: string) => {
  if (!username) return "Username is required!";
  return username.length >= 3
    ? null
    : "Username must be at least 3 characters!";
};

export const validateAddress = (address: string) => {
  if (!address) return "Address is required!";
  return address.length >= 5 ? null : "Address must be at least 5 characters!";
};

export const validateRole = (role: string) => {
  const validRoles = ["student", "tutor", "admin"];
  return validRoles.includes(role) ? null : "Invalid role!";
};
