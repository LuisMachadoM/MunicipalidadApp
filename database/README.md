# Base de datos - Municipio en Línea

## Requisitos
- MySQL 8 o superior

## Cómo ejecutar
1. Abrir MySQL Workbench o consola MySQL.
2. Ejecutar el archivo `schema.sql`.
3. El script crea la base de datos `municipio_en_linea`, sus tablas, índices y datos de prueba.

## Tablas principales
- usuarios
- tramites
- formularios
- campos_formulario
- solicitudes
- respuestas_solicitud
- documentos_adjuntos
- historial_estado
- respuestas_formulario

## Nota
Se agregó la tabla `respuestas_formulario` porque los formularios son dinámicos. Sin esa tabla, no se podrían guardar correctamente los valores que el ciudadano completa en cada trámite.
