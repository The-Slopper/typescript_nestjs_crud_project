import * as bcrypt from 'bcrypt';
import { hashPassword } from './password.util';

jest.mock('bcrypt', () => ({
  hash: jest.fn(async (plain: string, rounds: number) => `hashed-${plain}-${rounds}`),
}));

describe('hashPassword', () => {
  it('delegates hashing to bcrypt', async () => {
    await expect(hashPassword('secret')).resolves.toBe('hashed-secret-10');
    expect(bcrypt.hash).toHaveBeenCalledWith('secret', 10);
  });
});
