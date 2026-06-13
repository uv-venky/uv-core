# uv-core

Reusable Node.js/TypeScript framework package aligned with the `core` repository stack: **pg**, **bcrypt-ts**, **jsonwebtoken**, **pino**, **js-yaml**, **zod**, and **Fetch API route handlers** (same Request/Response pattern as `core`'s `withDBRoutes`).

## Stack (matches `core`)

| Package | Purpose |
|---------|---------|
| `pg` | PostgreSQL pooling |
| `bcrypt-ts` | Password hashing |
| `jsonwebtoken` | JWT access tokens |
| `pino` / `pino-pretty` | Structured logging |
| `js-yaml` | YAML config (`config/default.yml`, `config/env.yml`) |
| `zod` | Input validation |
| `dotenv` | CLI script env loading (dev dependency) |
| `tsx` | Run TypeScript scripts |

## Project structure

```
config/
  default.yml
  env.yml
src/
├── auth/
├── database/
├── migrations/
├── common/
└── index.ts
migrations/
scripts/
examples/sample-app/
```

## Quick start

```bash
cp .env.example .env
# set DATABASE_URL and JWT_SECRET

npm install
npm run build
npm run migrate
npm run example
```

Default admin user (`admin@example.com` / `changeme`) is seeded in the init migration.

## Install in another repository

**Local path (development):**

```json
"uv-core": "file:../uv-core"
```

**GitHub:**

```bash
npm install github:<your-org>/uv-core#v1.0.0
```

**Usage:**

```typescript
import {
  loadConfig,
  login,
  withAuthRoute,
  withPublicRoute,
  readJsonBody,
} from 'uv-core';

loadConfig();
```

**Migrate scripts in consumer apps:**

```json
{
  "scripts": {
    "migrate": "tsx node_modules/uv-core/scripts/migrate.ts",
    "rollback": "tsx node_modules/uv-core/scripts/rollback.ts",
    "migration:create": "tsx node_modules/uv-core/scripts/create-migration.ts"
  }
}
```

See `../repo1` for a minimal consumer example.

## Migration conventions

- Table prefix: `uv_*` (e.g. `uv_users`, `uv_roles`, `uv_migrations`)
- Up: `{version}_{name}.sql`
- Down: `{version}_{name}.down.sql`

## License

MIT
