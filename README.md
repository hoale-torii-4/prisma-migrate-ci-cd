# Prisma Migrate + GitHub CI/CD Demo

Demo project Node.js to show how to manage Prisma migrations safely in CI/CD.

## Goal

- Keep migration files in Git.
- Validate migration on CI for every push/PR.
- Apply migration on CD with safety guardrails.
- Avoid dangerous commands in CD such as `prisma db push`, `prisma migrate reset`.

## Stack

- Node.js + Express
- Prisma ORM
- MySQL
- GitHub Actions (CI/CD)

## Project structure

- `src/index.js`: simple API + health check
- `prisma/schema.prisma`: data model
- `prisma/migrations/*`: versioned SQL migrations
- `prisma/seed.js`: demo seed data
- `scripts/safe-migrate.js`: safe migration script for CD
- `.github/workflows/ci.yml`: validate migration in CI
- `.github/workflows/cd.yml`: run migration then deploy in CD

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create env file from example:

```bash
cp .env.example .env
```

3. Apply migration and seed data:

```bash
npm run prisma:migrate:deploy
npm run db:seed
```

4. Start app:

```bash
npm run dev
```

Health endpoint: `GET /health`
Users endpoint: `GET /users`

## Migration workflow

### When changing schema

1. Update `prisma/schema.prisma`.
2. Generate migration locally:

```bash
npm run prisma:migrate:dev -- --name your_change_name
```

3. Commit all files in `prisma/migrations`.
4. Open PR. CI will run `prisma migrate deploy` on an isolated MySQL service.

### On production CD

- CD pipeline runs `npm run migrate:safe` before app deploy.
- `scripts/safe-migrate.js` blocks production migration unless:
  - `NODE_ENV=production`
  - `ALLOW_PROD_MIGRATE=true`
- Migration command used in CD is only:

```bash
prisma migrate deploy
```

This command applies pending migration files only and does not reset the database.

## GitHub Secrets needed

In repository Settings -> Secrets and variables -> Actions:

- `DATABASE_URL`: production database connection string.
- `ALLOW_PROD_MIGRATE`: set to `true` only when you want CD to run migrations.

## Important notes to avoid DB loss

- Never run `prisma migrate reset` in CI/CD.
- Never use `prisma db push` in production CD.
- Always backup production DB before setting `ALLOW_PROD_MIGRATE=true`.
- Use `workflow_dispatch` for manual re-run when you need controlled deployment.
