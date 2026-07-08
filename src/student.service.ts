import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { hashPassword } from './password.util';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @InjectRepository(Student)
    private repo: Repository<Student>,
  ) {}

  async list(name?: string): Promise<Student[]> {
    if (name) {
      this.logger.log(JSON.stringify({ action: 'search', name }));
      return this.repo
        .createQueryBuilder('student')
        .where('LOWER(student.name) LIKE LOWER(:name)', {
          name: `%${name}%`,
        })
        .getMany();
    }
    this.logger.log(JSON.stringify({ action: 'list' }));
    return this.repo.find();
  }

  async find(id: number): Promise<Student> {
    const student = await this.repo.findOneBy({ id });
    if (!student) {
      throw new NotFoundException(`Student ${id} not found`);
    }
    return student;
  }

  async create(data: CreateStudentDto): Promise<Student> {
    const hashedPassword = await hashPassword(data.password);
    const student = this.repo.create({ ...data, password: hashedPassword });
    const saved = await this.repo.save(student);
    this.logger.log(
      JSON.stringify({ action: 'create', id: saved.id, email: saved.email }),
    );
    return saved;
  }

  async update(id: number, data: UpdateStudentDto): Promise<Student> {
    const student = await this.find(id);
    const payload: UpdateStudentDto = { ...data };
    if (data.password) {
      payload.password = await hashPassword(data.password);
    }
    Object.assign(student, payload);
    const saved = await this.repo.save(student);
    this.logger.log(JSON.stringify({ action: 'update', id: saved.id }));
    return saved;
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    // Idempotent: deleting a missing student still succeeds
    this.logger.log(
      JSON.stringify({
        action: 'delete',
        id,
        affected: result.affected ?? 0,
      }),
    );
  }
}
