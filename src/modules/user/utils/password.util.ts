import * as argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

export async function comparePassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return argon2.verify(hash, plain);
}

export function isPasswordStrong(password: string): boolean {
  const minLength = 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return password.length >= minLength && hasLetter && hasNumber;
}
