import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

describe('StudentController', () => {
  let controller: StudentController;
  const service = {
    list: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [{ provide: StudentService, useValue: service }],
    }).compile();

    controller = module.get<StudentController>(StudentController);
    jest.clearAllMocks();
  });

  it('lists students', async () => {
    service.list.mockResolvedValue([{ id: 1, name: 'Ana' }]);
    await expect(controller.list()).resolves.toEqual([{ id: 1, name: 'Ana' }]);
    expect(service.list).toHaveBeenCalledWith(undefined);
  });

  it('lists students filtered by name', async () => {
    service.list.mockResolvedValue([{ id: 1, name: 'Ana' }]);
    await expect(controller.list('Ana')).resolves.toEqual([
      { id: 1, name: 'Ana' },
    ]);
    expect(service.list).toHaveBeenCalledWith('Ana');
  });

  it('returns student detail', async () => {
    service.find.mockResolvedValue({ id: 1, name: 'Ana' });
    await expect(controller.detail(1)).resolves.toEqual({ id: 1, name: 'Ana' });
    expect(service.find).toHaveBeenCalledWith(1);
  });

  it('creates a student', async () => {
    const dto = {
      name: 'Ana',
      email: 'ana@example.com',
      password: 'senha123',
      grid: 8,
    };
    service.create.mockResolvedValue({ id: 1, ...dto });
    await expect(controller.create(dto)).resolves.toMatchObject({ id: 1 });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('updates a student', async () => {
    service.update.mockResolvedValue({ id: 1, grid: 10 });
    await expect(controller.update(1, { grid: 10 })).resolves.toMatchObject({
      id: 1,
      grid: 10,
    });
    expect(service.update).toHaveBeenCalledWith(1, { grid: 10 });
  });

  it('removes a student', async () => {
    service.remove.mockResolvedValue(undefined);
    await expect(controller.remove(1)).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
