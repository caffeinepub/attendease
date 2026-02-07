export function validatePhoneNumber(phoneNumber: string): string | null {
  if (!phoneNumber) {
    return 'Phone number is required';
  }

  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length < 10) {
    return 'Phone number must be at least 10 digits';
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return null;
}
