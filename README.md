# Serviço de Alunos (NestJS)

API de alunos com NestJS e TypeORM.

## Metadados

| Campo | Valor |
|-------|-------|
| Linguagem | TypeScript |
| Framework | NestJS 10 |
| ORM | TypeORM |
| Banco de dados | PostgreSQL |
| Versão | 1.0.0 |
| Licença | MIT |
| Responsável | Equipe de Plataforma |

## Descrição

Serviço com o CRUD de alunos e busca por nome, organizado em módulo, controller, service e
entidade do TypeORM.

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/alunos` | Lista de alunos |
| GET | `/alunos/:id` | Detalhe de um aluno |
| POST | `/alunos` | Cria um aluno |
| PUT | `/alunos/:id` | Atualiza um aluno |
| DELETE | `/alunos/:id` | Remove um aluno |

## Estrutura

```
typescript-nestjs/
├── package.json
└── src/
    ├── main.ts
    ├── aluno.entity.ts
    ├── aluno.service.ts
    ├── aluno.controller.ts
    └── aluno.service.spec.ts
```

## Como executar

```bash
npm install
npm run start
# servidor em http://localhost:3000
```

## Configuração

Conexão definida em `src/aluno.entity.ts` / `src/main.ts`. Testes com `npm test` (Jest).
