import * as bcrypt from 'bcrypt';

const ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}
