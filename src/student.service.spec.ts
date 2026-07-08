import { NotFoundException } from '@nestjs/common';
import { StudentService } from './student.service';

jest.mock('./password.util', () => ({
  hashPassword: jest.fn(async (plain: string) => `hashed:${plain}`),
}));

import { hashPassword } from './password.util';

describe('StudentService', () => {
  let service: StudentService;
  let repo: {
    find: jest.Mock;
    findOneBy: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    delete: jest.Mock;
    createQueryBuilder: jest.Mock;
  };

  beforeEach(() => {
    repo = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn((data) => data),
      save: jest.fn(async (data) => ({ id: 1, ...data })),
      delete: jest.fn(async () => ({ affected: 1 })),
      createQueryBuilder: jest.fn(),
    };
    service = new StudentService(repo as any);
    jest.clearAllMocks();
  });

  it('lists all students', async () => {
    repo.find.mockResolvedValue([{ id: 1, name: 'Ana' }]);
    await expect(service.list()).resolves.toEqual([{ id: 1, name: 'Ana' }]);
  });

  it('searches by name', async () => {
    const getMany = jest.fn().mockResolvedValue([{ id: 2, name: 'Fatima' }]);
    const where = jest.fn().mockReturnValue({ getMany });
    repo.createQueryBuilder.mockReturnValue({ where });

    await expect(service.list('Fat')).resolves.toEqual([
      { id: 2, name: 'Fatima' },
    ]);
    expect(repo.createQueryBuilder).toHaveBeenCalledWith('student');
  });

  it('throws when student is missing', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.find(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates a student with hashed password', async () => {
    const data = {
      name: 'Ana',
      email: 'ana@example.com',
      password: 'senha123',
      grid: 8,
    };
    await expect(service.create(data)).resolves.toMatchObject({
      id: 1,
      name: 'Ana',
      password: 'hashed:senha123',
    });
    expect(hashPassword).toHaveBeenCalledWith('senha123');
    expect(repo.create).toHaveBeenCalledWith({
      ...data,
      password: 'hashed:senha123',
    });
  });

  it('updates a student', async () => {
    repo.findOneBy.mockResolvedValue({
      id: 1,
      name: 'Ana',
      email: 'ana@example.com',
      password: 'hashed:senha123',
      grid: 8,
    });
    await expect(service.update(1, { grid: 10 })).resolves.toMatchObject({
      id: 1,
      grid: 10,
    });
  });

  it('hashes password on update when provided', async () => {
    repo.findOneBy.mockResolvedValue({
      id: 1,
      name: 'Ana',
      email: 'ana@example.com',
      password: 'hashed:old',
      grid: 8,
    });
    await service.update(1, { password: 'nova123' });
    expect(hashPassword).toHaveBeenCalledWith('nova123');
    expect(repo.save).toHaveBeenCalledWith(
      expect.objectContaining({ password: 'hashed:nova123' }),
    );
  });

  it('deletes idempotently when student is missing', async () => {
    repo.delete.mockResolvedValue({ affected: 0 });
    await expect(service.remove(99)).resolves.toBeUndefined();
  });
});
