/** Приводит ввод пользователя к виду +7 (999) 123-45-67 */
export function formatPhone(input: string): string {
  let digits = input.replace(/\D/g, "");

  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (!digits.startsWith("7")) digits = `7${digits}`;
  digits = digits.slice(0, 11);

  const rest = digits.slice(1);
  let result = "+7";

  if (rest.length > 0) result += ` (${rest.slice(0, 3)}`;
  if (rest.length >= 3) result += ")";
  if (rest.length > 3) result += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) result += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) result += `-${rest.slice(8, 10)}`;

  return result;
}

export function isPhoneComplete(value: string): boolean {
  return value.replace(/\D/g, "").length === 11;
}
