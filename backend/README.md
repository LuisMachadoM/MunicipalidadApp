# Backend - Municipio en Línea

Backend base en Node.js + Express + MySQL.

## Instalación
```bash
npm install
cp .env.example .env
npm run dev
```

## Endpoints
### Auth
- POST /api/auth/register
- POST /api/auth/login

### Trámites
- GET /api/tramites
- GET /api/tramites/:id
- GET /api/formularios/tramite/:idTramite

### Solicitudes
- POST /api/solicitudes
- GET /api/solicitudes/mis-tramites
- GET /api/solicitudes/:id

### Funcionario
- GET /api/funcionario/solicitudes
- PUT /api/funcionario/solicitudes/:id/aprobar
- PUT /api/funcionario/solicitudes/:id/rechazar
- PUT /api/funcionario/solicitudes/:id/observar
