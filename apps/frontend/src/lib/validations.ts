/**
 * Valida DNI peruano (8 dígitos)
 */
export function validateDNI(dni: string): boolean {
  const dniRegex = /^\d{8}$/;
  return dniRegex.test(dni);
}

/**
 * Valida teléfono peruano (9 dígitos)
 */
export function validatePeruvianPhone(phone: string): boolean {
  // Acepta formato: 987654321 o +51987654321
  const phoneRegex = /^(\+51)?9\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Valida RUC peruano (11 dígitos)
 */
export function validateRUC(ruc: string): boolean {
  const rucRegex = /^\d{11}$/;
  return rucRegex.test(ruc);
}

/**
 * Valida email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida URL
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida que sea mayor de 18 años
 */
export function validateAge(dateOfBirth: string): boolean {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    return age - 1 >= 18;
  }

  return age >= 18;
}
