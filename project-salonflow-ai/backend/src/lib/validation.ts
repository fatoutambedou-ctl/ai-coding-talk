/** Normalise un numéro : garde les chiffres et un éventuel « + » initial. */
export function normalizePhone(input: string): string {
  const trimmed = input.trim();
  const digits = trimmed.replace(/\D/g, "");
  return trimmed.startsWith("+") ? `+${digits}` : digits;
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

export function isValidName(name: string): boolean {
  const n = name.trim();
  return n.length >= 2 && n.length <= 60;
}
