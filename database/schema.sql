
-- =========================================================
-- MUNICIPIO EN LÍNEA - MUNICIPALIDAD DE PUERTO MONTT
-- Motor: MySQL 8+
-- Archivo: schema.sql
-- =========================================================

DROP DATABASE IF EXISTS municipio_en_linea;
CREATE DATABASE municipio_en_linea
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE municipio_en_linea;

-- =========================================================
-- TABLA: usuarios
-- Almacena ciudadanos y funcionarios
-- =========================================================
CREATE TABLE usuarios (
    id_usuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rut VARCHAR(20) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('CIUDADANO', 'FUNCIONARIO') NOT NULL,
    estado_usuario ENUM('ACTIVO', 'INACTIVO', 'BLOQUEADO') NOT NULL DEFAULT 'ACTIVO',
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_usuarios_rut UNIQUE (rut),
    CONSTRAINT uq_usuarios_correo UNIQUE (correo)
) ENGINE=InnoDB;

-- =========================================================
-- TABLA: tramites
-- Catálogo de trámites disponibles en la plataforma
-- =========================================================
CREATE TABLE tramites (
    id_tramite INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre_tramite VARCHAR(150) NOT NULL,
    descripcion TEXT NULL,
    estado_publicacion ENUM('BORRADOR', 'PUBLICADO', 'OCULTO') NOT NULL DEFAULT 'BORRADOR',
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tramites_nombre UNIQUE (nombre_tramite)
) ENGINE=InnoDB;

-- =========================================================
-- TABLA: formularios
-- Cada trámite posee un formulario configurable
-- =========================================================
CREATE TABLE formularios (
    id_formulario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_tramite INT UNSIGNED NOT NULL,
    nombre_formulario VARCHAR(150) NOT NULL,
    descripcion_formulario TEXT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_formularios_tramites
        FOREIGN KEY (id_tramite) REFERENCES tramites(id_tramite)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT uq_formularios_tramite UNIQUE (id_tramite)
) ENGINE=InnoDB;

-- =========================================================
-- TABLA: campos_formulario
-- Define la estructura dinámica de los formularios
-- =========================================================
CREATE TABLE campos_formulario (
    id_campo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_formulario INT UNSIGNED NOT NULL,
    nombre_campo VARCHAR(120) NOT NULL,
    etiqueta VARCHAR(150) NOT NULL,
    tipo_campo ENUM('texto', 'numero', 'archivo', 'fecha', 'correo', 'textarea') NOT NULL,
    obligatorio BOOLEAN NOT NULL DEFAULT FALSE,
    placeholder VARCHAR(200) NULL,
    orden_visualizacion INT NOT NULL DEFAULT 1,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_campos_formulario_formularios
        FOREIGN KEY (id_formulario) REFERENCES formularios(id_formulario)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- TABLA: solicitudes
-- Registro principal de trámites enviados por ciudadanos
-- =========================================================
CREATE TABLE solicitudes (
    id_solicitud INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNSIGNED NOT NULL,
    id_tramite INT UNSIGNED NOT NULL,
    fecha_ingreso DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado_actual ENUM('PENDIENTE', 'OBSERVADO', 'APROBADO', 'RECHAZADO') NOT NULL DEFAULT 'PENDIENTE',
    observacion_general TEXT NULL,
    CONSTRAINT fk_solicitudes_usuarios
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_solicitudes_tramites
        FOREIGN KEY (id_tramite) REFERENCES tramites(id_tramite)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =========================================================
-- TABLA: respuestas_solicitud
-- Acciones realizadas por funcionarios sobre una solicitud
-- =========================================================
CREATE TABLE respuestas_solicitud (
    id_respuesta INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_solicitud INT UNSIGNED NOT NULL,
    id_funcionario INT UNSIGNED NOT NULL,
    accion_realizada ENUM('APROBACION', 'RECHAZO', 'OBSERVACION', 'RESPUESTA') NOT NULL,
    comentario TEXT NULL,
    fecha_respuesta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_respuestas_solicitud
        FOREIGN KEY (id_solicitud) REFERENCES solicitudes(id_solicitud)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_respuestas_funcionario
        FOREIGN KEY (id_funcionario) REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =========================================================
-- TABLA: documentos_adjuntos
-- Archivos subidos por ciudadanos o funcionarios
-- =========================================================
CREATE TABLE documentos_adjuntos (
    id_documento INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_solicitud INT UNSIGNED NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tipo_documento ENUM('ANTECEDENTE', 'RESPUESTA') NOT NULL,
    cargado_por ENUM('CIUDADANO', 'FUNCIONARIO') NOT NULL,
    fecha_carga DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_documentos_solicitud
        FOREIGN KEY (id_solicitud) REFERENCES solicitudes(id_solicitud)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- TABLA: historial_estado
-- Trazabilidad de cambios de estado de cada solicitud
-- =========================================================
CREATE TABLE historial_estado (
    id_historial INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_solicitud INT UNSIGNED NOT NULL,
    estado_anterior ENUM('PENDIENTE', 'OBSERVADO', 'APROBADO', 'RECHAZADO') NULL,
    estado_nuevo ENUM('PENDIENTE', 'OBSERVADO', 'APROBADO', 'RECHAZADO') NOT NULL,
    fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_funcionario INT UNSIGNED NULL,
    CONSTRAINT fk_historial_solicitud
        FOREIGN KEY (id_solicitud) REFERENCES solicitudes(id_solicitud)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_historial_funcionario
        FOREIGN KEY (id_funcionario) REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================================================
-- TABLA OPCIONAL DE APOYO: respuestas_formulario
-- Guarda los valores ingresados en cada campo dinámico
-- Esta tabla es importante para implementar formularios reales.
-- =========================================================
CREATE TABLE respuestas_formulario (
    id_respuesta_formulario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_solicitud INT UNSIGNED NOT NULL,
    id_campo INT UNSIGNED NOT NULL,
    valor_texto TEXT NULL,
    valor_numero DECIMAL(12,2) NULL,
    valor_fecha DATE NULL,
    valor_archivo VARCHAR(500) NULL,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resp_form_solicitud
        FOREIGN KEY (id_solicitud) REFERENCES solicitudes(id_solicitud)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_resp_form_campo
        FOREIGN KEY (id_campo) REFERENCES campos_formulario(id_campo)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- ÍNDICES RECOMENDADOS
-- =========================================================
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX idx_tramites_estado_pub ON tramites(estado_publicacion);
CREATE INDEX idx_campos_formulario_formulario ON campos_formulario(id_formulario, orden_visualizacion);
CREATE INDEX idx_solicitudes_usuario ON solicitudes(id_usuario);
CREATE INDEX idx_solicitudes_tramite ON solicitudes(id_tramite);
CREATE INDEX idx_solicitudes_estado ON solicitudes(estado_actual);
CREATE INDEX idx_respuestas_solicitud ON respuestas_solicitud(id_solicitud);
CREATE INDEX idx_documentos_solicitud ON documentos_adjuntos(id_solicitud);
CREATE INDEX idx_historial_solicitud ON historial_estado(id_solicitud);
CREATE INDEX idx_respuestas_formulario_solicitud ON respuestas_formulario(id_solicitud);

-- =========================================================
-- DATOS DE PRUEBA BÁSICOS
-- =========================================================

INSERT INTO usuarios (nombre, apellido, rut, correo, password_hash, tipo_usuario)
VALUES
('Juan', 'Pérez', '11.111.111-1', 'juan.perez@example.com', '$2b$10$hash_simulado_ciudadano', 'CIUDADANO'),
('María', 'González', '22.222.222-2', 'maria.gonzalez@puertomontt.cl', '$2b$10$hash_simulado_funcionario', 'FUNCIONARIO');

INSERT INTO tramites (nombre_tramite, descripcion, estado_publicacion)
VALUES
('Patente Provisoria', 'Solicitud de patente provisoria.', 'PUBLICADO'),
('Patente Profesional', 'Solicitud de patente profesional.', 'PUBLICADO'),
('Patente Comercial', 'Solicitud de patente comercial.', 'PUBLICADO'),
('Solicitud de Cierre de Calles', 'Solicitud para cierre temporal de calles.', 'PUBLICADO');

INSERT INTO formularios (id_tramite, nombre_formulario, descripcion_formulario)
VALUES
(1, 'Formulario Patente Provisoria', 'Formulario base para patente provisoria'),
(2, 'Formulario Patente Profesional', 'Formulario base para patente profesional'),
(3, 'Formulario Patente Comercial', 'Formulario base para patente comercial'),
(4, 'Formulario Cierre de Calles', 'Formulario base para solicitud de cierre de calles');

INSERT INTO campos_formulario (id_formulario, nombre_campo, etiqueta, tipo_campo, obligatorio, placeholder, orden_visualizacion)
VALUES
(1, 'nombre_solicitante', 'Nombre del solicitante', 'texto', TRUE, 'Ingrese nombre completo', 1),
(1, 'rut_solicitante', 'RUT del solicitante', 'texto', TRUE, 'Ingrese RUT', 2),
(1, 'documento_respaldo', 'Documento de respaldo', 'archivo', TRUE, NULL, 3),

(4, 'nombre_evento', 'Nombre de la actividad', 'texto', TRUE, 'Ingrese nombre de la actividad', 1),
(4, 'cantidad_asistentes', 'Cantidad estimada de asistentes', 'numero', TRUE, 'Ingrese cantidad', 2),
(4, 'plano_cierre', 'Plano o documento de respaldo', 'archivo', TRUE, NULL, 3);

INSERT INTO solicitudes (id_usuario, id_tramite, estado_actual, observacion_general)
VALUES
(1, 1, 'PENDIENTE', 'Solicitud ingresada correctamente.');

INSERT INTO documentos_adjuntos (id_solicitud, nombre_archivo, ruta_archivo, tipo_documento, cargado_por)
VALUES
(1, 'cedula.pdf', '/uploads/solicitudes/1/cedula.pdf', 'ANTECEDENTE', 'CIUDADANO');

INSERT INTO historial_estado (id_solicitud, estado_anterior, estado_nuevo, id_funcionario)
VALUES
(1, NULL, 'PENDIENTE', NULL);

INSERT INTO respuestas_formulario (id_solicitud, id_campo, valor_texto)
VALUES
(1, 1, 'Juan Pérez'),
(1, 2, '11.111.111-1');
