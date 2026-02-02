## Instalación

1. Clonar el repositorio:
```bash
   git clone https://github.com/santiago-ondris/wheels-house.git
   cd wheels
```

2. Instalar dependencias:
```bash
   pnpm install
```

3. Correr en desarrollo:
```bash
   pnpm dev
```

   Esto levanta:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## Scripts naz

pnpm --filter @wheels/api test

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Corre frontend y backend |
| `pnpm --filter @wheels/web dev` | Solo frontend |
| `pnpm --filter @wheels/api dev` | Solo backend |
| `pnpm build` | Build de producción |