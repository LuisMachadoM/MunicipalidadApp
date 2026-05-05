# Municipio en Línea

Proyecto web orientado a la digitalización de trámites municipales para la Municipalidad de Puerto Montt.

## Descripción

El sistema permite que los ciudadanos puedan registrarse, iniciar sesión, revisar trámites disponibles, completar formularios, adjuntar documentos y enviar solicitudes en línea.  
Además, considera un perfil de funcionario municipal, quien puede revisar las solicitudes ingresadas y cambiar su estado a aprobado, rechazado u observado.

## Tecnologías utilizadas

* React
* Node.js
* Express
* MySQL
* CSS
* JWT
* bcrypt

## Estructura del proyecto

```text
municipio-en-linea/
├── frontend/
├── backend/
├── database/
└── README.md
```

## Módulos principales

### Ciudadano

* Registro
* Inicio de sesión
* Ver trámites
* Completar formulario
* Adjuntar documentos
* Enviar solicitud
* Revisar estado de trámites

### Funcionario

* Inicio de sesión
* Ver solicitudes ingresadas
* Aprobar solicitud
* Rechazar solicitud
* Emitir observaciones

## Base de datos

La base de datos fue implementada en MySQL y considera tablas para:

* usuarios
* trámites
* formularios
* campos de formulario
* solicitudes
* documentos adjuntos
* historial de estados

## Ejecución general

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Base de datos

Importar el archivo `schema.sql` ubicado en la carpeta `database`.

## Estado del proyecto

Proyecto en desarrollo como parte de la asignatura Proyecto de Título.

## Autor

Luis Machado Molina

