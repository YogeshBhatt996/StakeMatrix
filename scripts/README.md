# Scripts

## Available scripts (package.json)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at http://localhost:3000 |
| `npm run build` | Generate Prisma client + build Next.js for production |
| `npm run start` | Start production server (after build) |
| `npm run lint` | Run ESLint |

## Utility commands

### Generate Prisma client only
```bash
npx prisma generate
```

### Seed the database (creates admin user)
```bash
npx tsx prisma/seed.ts
```

### Open Prisma Studio (local DB browser)
```bash
npx prisma studio
```

### Check Prisma schema validity
```bash
npx prisma validate
```

### Format Prisma schema
```bash
npx prisma format
```

## Windows-specific note
**Always stop `npm run dev` before running `npm run build`.**
The dev server holds `node_modules/.prisma/client/query_engine-windows.dll.node` and the build will fail with EPERM.

```powershell
# Kill all node processes:
Stop-Process -Name "node" -Force
```
