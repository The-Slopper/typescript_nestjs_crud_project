# =============================================================================
# Script de exemplos — Branches e PRs para aprovação
# Projeto: typescript_nestjs_crud_project
#
# Uso: leia cada seção e execute os comandos manualmente no PowerShell.
# NÃO commite o arquivo .env (senha real).
# =============================================================================

Write-Host "=== Branches sugeridas para revisão/aprovação ===" -ForegroundColor Cyan
Write-Host ""

# -----------------------------------------------------------------------------
# VISÃO GERAL DAS BRANCHES (empilhadas — cada PR baseia na anterior)
# -----------------------------------------------------------------------------
$branches = @(
    @{
        Name        = "feature/setup-nest-postgres"
        Title       = "feat: configurar NestJS com PostgreSQL via variáveis de ambiente"
        Description = @"
## Resumo
- Adiciona tsconfig, nest-cli e dependências NestJS
- Conecta PostgreSQL via .env (Twelve-Factor / SPEC §7)
- Substitui arquivos quebrados aluno.* por student.*
- CRUD básico funcional

## Test plan
- [ ] npm install
- [ ] npm run build
- [ ] npm run start com .env configurado
- [ ] POST /students cadastra no banco
"@
        Files       = @(
            "tsconfig.json",
            "nest-cli.json",
            "package.json",
            "package-lock.json",
            ".env.example",
            "src/student.entity.ts",
            "src/student.controller.ts",
            "src/student.service.ts",
            "src/main.ts",
            "tests/core.test.ts"
        )
    },
    @{
        Name        = "feature/validation-and-errors"
        Title       = "feat: validação de input e erros padronizados (RF-02, RF-03)"
        Description = @"
## Resumo
- DTOs com class-validator
- ValidationPipe global
- HttpExceptionFilter com resposta consistente

## Test plan
- [ ] POST com body inválido retorna 400
- [ ] Erro retorna { statusCode, message, path, timestamp }
"@
        Files       = @(
            "src/dto/create-student.dto.ts",
            "src/dto/update-student.dto.ts",
            "src/http-exception.filter.ts",
            "src/main.ts"
        )
    },
    @{
        Name        = "feature/health-search-logging"
        Title       = "feat: health-check, busca por nome e logs estruturados (RF-04)"
        Description = @"
## Resumo
- GET /health
- GET /students?name=...
- Logs JSON nas operações do service
- DELETE idempotente

## Test plan
- [ ] GET /health retorna status ok
- [ ] GET /students?name=Maria filtra resultados
"@
        Files       = @(
            "src/health.controller.ts",
            "src/student.controller.ts",
            "src/student.service.ts",
            "src/student.entity.ts"
        )
    },
    @{
        Name        = "feature/password-security"
        Title       = "feat: hash de senha com bcrypt (SPEC segurança)"
        Description = @"
## Resumo
- Senha hasheada no create/update
- Password omitido nas respostas da API
- BCRYPT_ROUNDS configurável via .env

## Test plan
- [ ] Novo aluno salva senha hasheada no banco
- [ ] GET /students não expõe password
"@
        Files       = @(
            "src/password.util.ts",
            "src/student.service.ts",
            ".env.example"
        )
    },
    @{
        Name        = "feature/tests-and-ci"
        Title       = "test: cobertura de testes e CI real (SPEC §9)"
        Description = @"
## Resumo
- Testes de controller, service, health, filter e password
- Script test:cov com threshold de cobertura
- CI executa npm ci, test:cov e build

## Test plan
- [ ] npm run test:cov passa
- [ ] npm run build passa
- [ ] GitHub Actions verde
"@
        Files       = @(
            "src/student.controller.spec.ts",
            "src/student.service.spec.ts",
            "src/health.controller.spec.ts",
            "src/http-exception.filter.spec.ts",
            "src/password.util.spec.ts",
            ".github/workflows/ci.yml",
            "package.json"
        )
    }
)

foreach ($b in $branches) {
    Write-Host "Branch: $($b.Name)" -ForegroundColor Yellow
    Write-Host "  PR: $($b.Title)"
    Write-Host "  Arquivos:"
    $b.Files | ForEach-Object { Write-Host "    - $_" }
    Write-Host ""
}

# -----------------------------------------------------------------------------
# OPÇÃO A — UMA ÚNICA BRANCH (mais simples)
# -----------------------------------------------------------------------------
Write-Host "=== OPÇÃO A: um único PR com tudo ===" -ForegroundColor Green
Write-Host @"

git checkout main
git pull origin main
git checkout -b feature/student-api-complete

git add tsconfig.json nest-cli.json package.json package-lock.json .env.example
git add src/ tests/core.test.ts .github/workflows/ci.yml
git add -u src/aluno.controller.ts src/aluno.entity.ts src/aluno.service.ts src/aluno.service.spec.ts

git status
git commit -m "feat: implementar CRUD de alunos conforme SPEC"

git push -u origin feature/student-api-complete

gh pr create --title "feat: API de alunos NestJS (CRUD + SPEC)" --body "## Summary
- CRUD REST com PostgreSQL e TypeORM
- Validação, erros padronizados, health-check e busca por nome
- Hash de senha com bcrypt
- Testes com cobertura e CI real

## Test plan
- [ ] npm install && npm run test:cov && npm run build
- [ ] npm run start com .env
- [ ] POST/GET/PUT/DELETE /students
- [ ] GET /health
- [ ] GET /students?name=..."

"@

# -----------------------------------------------------------------------------
# OPÇÃO B — VÁRIAS BRANCHES EMPILHADAS (revisão por partes)
# -----------------------------------------------------------------------------
Write-Host "=== OPÇÃO B: PRs empilhados (revisão por partes) ===" -ForegroundColor Green
Write-Host @"

# --- PR 1: Setup ---
git checkout main
git pull origin main
git checkout -b feature/setup-nest-postgres

git add tsconfig.json nest-cli.json package.json package-lock.json .env.example
git add src/student.entity.ts src/student.controller.ts src/student.service.ts src/main.ts
git add tests/core.test.ts
git add -u src/aluno.controller.ts src/aluno.entity.ts src/aluno.service.ts src/aluno.service.spec.ts
git commit -m "feat: configurar NestJS com PostgreSQL via env"
git push -u origin feature/setup-nest-postgres
gh pr create --base main --head feature/setup-nest-postgres `
  --title "feat: configurar NestJS com PostgreSQL via env" `
  --body "Setup inicial: tsconfig, deps, entity, CRUD base e .env.example"

# --- PR 2: Validação (base: branch anterior) ---
git checkout feature/setup-nest-postgres
git checkout -b feature/validation-and-errors

git add src/dto/ src/http-exception.filter.ts src/main.ts
git commit -m "feat: validação de input e erros padronizados"
git push -u origin feature/validation-and-errors
gh pr create --base feature/setup-nest-postgres --head feature/validation-and-errors `
  --title "feat: validação e erros padronizados (RF-02, RF-03)" `
  --body "DTOs, ValidationPipe e HttpExceptionFilter"

# --- PR 3: Health + busca + logs ---
git checkout feature/validation-and-errors
git checkout -b feature/health-search-logging

git add src/health.controller.ts src/student.controller.ts src/student.service.ts src/student.entity.ts
git commit -m "feat: health-check, busca por nome e logs estruturados"
git push -u origin feature/health-search-logging
gh pr create --base feature/validation-and-errors --head feature/health-search-logging `
  --title "feat: health, busca por nome e logs (RF-04)" `
  --body "GET /health, ?name= e logs JSON no service"

# --- PR 4: Segurança ---
git checkout feature/health-search-logging
git checkout -b feature/password-security

git add src/password.util.ts src/student.service.ts .env.example
git commit -m "feat: hash de senha com bcrypt"
git push -u origin feature/password-security
gh pr create --base feature/health-search-logging --head feature/password-security `
  --title "feat: hash de senha com bcrypt" `
  --body "Senha hasheada no cadastro; não exposta na API"

# --- PR 5: Testes + CI ---
git checkout feature/password-security
git checkout -b feature/tests-and-ci

git add src/*.spec.ts .github/workflows/ci.yml package.json
git commit -m "test: cobertura de testes e CI real"
git push -u origin feature/tests-and-ci
gh pr create --base feature/password-security --head feature/tests-and-ci `
  --title "test: testes e CI real" `
  --body "18 testes, test:cov e pipeline GitHub Actions"

"@

# -----------------------------------------------------------------------------
# OPÇÃO C — BRANCHES PARALELAS (nomes em português)
# -----------------------------------------------------------------------------
Write-Host "=== OPÇÃO C: nomes em português ===" -ForegroundColor Green
Write-Host @"

feature/configuracao-banco        # setup + .env + entity
feature/validacao-erros           # DTOs + filter
feature/health-logs               # /health + busca + logs
feature/seguranca-senha           # bcrypt
feature/testes-ci                 # specs + workflow

"@

# -----------------------------------------------------------------------------
# CHECKLIST ANTES DE ABRIR PR
# -----------------------------------------------------------------------------
Write-Host "=== Checklist antes do PR ===" -ForegroundColor Magenta
Write-Host @"

[ ] .env NÃO está no commit (só .env.example)
[ ] npm run test:cov passa
[ ] npm run build passa
[ ] API sobe com npm run start
[ ] Descreveu o test plan no corpo do PR

"@

Write-Host "Script de referência carregado. Copie os comandos acima conforme a opção escolhida." -ForegroundColor Cyan
