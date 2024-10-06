CREATE DATABASE bytransload
USE bytransload

-- Create the 'usuarios' table
CREATE TABLE dbo.usuarios (
    id INT NOT NULL IDENTITY(1,1),
    dni_usuario CHAR(11) COLLATE Latin1_General_CI_AS NOT NULL,
    clave_usuario VARCHAR(250) COLLATE Latin1_General_CI_AS NOT NULL,
    colaborador_usuario VARCHAR(250) COLLATE Latin1_General_CI_AS NOT NULL,
    brevete_usuario VARCHAR(250) COLLATE Latin1_General_CI_AS NOT NULL,
    telefono_usuario CHAR(9) COLLATE Latin1_General_CI_AS NOT NULL,
    email_usuario VARCHAR(250) COLLATE Latin1_General_CI_AS NOT NULL,
    area_usuario VARCHAR(250) COLLATE Latin1_General_CI_AS NOT NULL,
    cargo_usuario VARCHAR(250) COLLATE Latin1_General_CI_AS NOT NULL,
    conectado CHAR(1) COLLATE Latin1_General_CI_AS DEFAULT '0',
    id_creador_usuario INT DEFAULT NULL,
    estado CHAR(1) COLLATE Latin1_General_CI_AS NOT NULL DEFAULT '1',
    fecha_creado DATE NOT NULL,
    fecha_actualizado DATETIME NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (id)
);


-- Create the 'clientes' table
CREATE TABLE dbo.clientes (
    id INT NOT NULL IDENTITY(1,1),
    dni_cliente CHAR(11) COLLATE Latin1_General_CI_AS NOT NULL,
    razon_social_cliente VARCHAR(250) COLLATE Latin1_General_CI_AS NOT NULL,
    representante_cliente VARCHAR(250) COLLATE Latin1_General_CI_AS NOT NULL,
    clave_cliente VARCHAR(250) COLLATE Latin1_General_CI_AS NOT NULL,
    id_vendedor_usuario_cliente INT NOT NULL,
    limite_credito_cliente DECIMAL(15,4) NOT NULL,
    alerta_credito_cliente DECIMAL(15,4) NOT NULL,
    ubigeo_cliente CHAR(11) COLLATE Latin1_General_CI_AS NOT NULL,
    direccion_cliente VARCHAR(250) COLLATE Latin1_General_CI_AS NOT NULL,
    referencias_cliente VARCHAR(250) COLLATE Latin1_General_CI_AS NOT NULL,
    contacto_cliente VARCHAR(250) COLLATE Latin1_General_CI_AS NOT NULL,
    telefono_cliente CHAR(9) COLLATE Latin1_General_CI_AS NOT NULL,
    email_cliente VARCHAR(250) COLLATE Latin1_General_CI_AS NOT NULL,
    area_cliente VARCHAR(250) COLLATE Latin1_General_CI_AS NOT NULL,
    logo_cliente VARCHAR(250) COLLATE Latin1_General_CI_AS NOT NULL,
    id_creador_cliente INT DEFAULT NULL,
    estado CHAR(1) COLLATE Latin1_General_CI_AS NOT NULL DEFAULT '1',
    fecha_creado DATE NOT NULL,
    fecha_actualizado DATETIME NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (id)
);


CREATE TABLE dbo.distritos (
    id INT NOT NULL IDENTITY(1,1),
    nombre_dist VARCHAR(50) COLLATE Latin1_General_CI_AS DEFAULT NULL,
    ubigeo VARCHAR(15) COLLATE Latin1_General_CI_AS DEFAULT NULL,
    provincia_id INT NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE dbo.departamentos (
    id INT NOT NULL IDENTITY(1,1),
    nombre_dep VARCHAR(50) COLLATE Latin1_General_CI_AS DEFAULT NULL,
    ubigeo VARCHAR(15) COLLATE Latin1_General_CI_AS DEFAULT NULL,
    pais_id INT NOT NULL,
    activo INT DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME DEFAULT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE dbo.provincias (
    id INT NOT NULL IDENTITY(1,1),
    nombre_prov VARCHAR(50) COLLATE Latin1_General_CI_AS DEFAULT NULL,
    ubigeo VARCHAR(15) COLLATE Latin1_General_CI_AS DEFAULT NULL,
    departamento_id INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE dbo.ubigeo (
    UBIGEO INT NOT NULL,
    DEPARTAMENTO NVARCHAR(MAX) COLLATE Latin1_General_CI_AS,
    PROVINCIA NVARCHAR(MAX) COLLATE Latin1_General_CI_AS,
    DESTINO NVARCHAR(MAX) COLLATE Latin1_General_CI_AS,
    Zona NVARCHAR(MAX) COLLATE Latin1_General_CI_AS,
    id INT DEFAULT NULL,
    PRIMARY KEY (UBIGEO)
);

-- Crear la tabla 'envios'
CREATE TABLE dbo.envios (
    id_envio INT NOT NULL IDENTITY(1,1),
    cliente_id INT NOT NULL,
    usuario_id INT NOT NULL,
    transportista VARCHAR(100) COLLATE Latin1_General_CI_AS NOT NULL,
    ubigeo_destino INT NOT NULL,
    direccion_destino VARCHAR(250) COLLATE Latin1_General_CI_AS NOT NULL,
    fecha_envio DATETIME NOT NULL DEFAULT GETDATE(),
    estado_actual VARCHAR(50) COLLATE Latin1_General_CI_AS NOT NULL,
    PRIMARY KEY (id_envio),
    FOREIGN KEY (cliente_id) REFERENCES dbo.clientes(id),
    FOREIGN KEY (usuario_id) REFERENCES dbo.usuarios(id),
    FOREIGN KEY (ubigeo_destino) REFERENCES dbo.ubigeo(UBIGEO)
);

-- Crear la tabla 'seguimiento'
CREATE TABLE dbo.seguimiento (
    id_seguimiento INT NOT NULL IDENTITY(1,1),
    envio_id INT NOT NULL,
    fecha_actualizacion DATETIME NOT NULL DEFAULT GETDATE(),
    estado VARCHAR(50) COLLATE Latin1_General_CI_AS NOT NULL,
    observaciones TEXT COLLATE Latin1_General_CI_AS NULL,
    PRIMARY KEY (id_seguimiento),
    FOREIGN KEY (envio_id) REFERENCES dbo.envios(id_envio)
);



-- Insertar registros en la tabla 'usuarios'
INSERT INTO dbo.usuarios (dni_usuario, clave_usuario, colaborador_usuario, brevete_usuario, telefono_usuario, email_usuario, area_usuario, cargo_usuario, conectado, id_creador_usuario, estado, fecha_creado, fecha_actualizado)
VALUES 
('12345678901', 'clave123', 'Juan Pérez', 'BP001', '987654321', 'juan.perez@example.com', 'Ventas', 'Vendedor', '0', NULL, '1', '2023-01-01', GETDATE()),
('23456789012', 'clave234', 'Ana López', 'BP002', '976543210', 'ana.lopez@example.com', 'Marketing', 'Analista', '1', NULL, '1', '2023-02-01', GETDATE()),
('34567890123', 'clave345', 'Luis García', 'BP003', '965432109', 'luis.garcia@example.com', 'IT', 'Desarrollador', '0', NULL, '1', '2023-03-01', GETDATE()),
('45678901234', 'clave456', 'María Fernández', 'BP004', '954321098', 'maria.fernandez@example.com', 'Recursos Humanos', 'Gerente', '1', NULL, '1', '2023-04-01', GETDATE()),
('56789012345', 'clave567', 'Carlos Sánchez', 'BP005', '943210987', 'carlos.sanchez@example.com', 'Logística', 'Coordinador', '0', NULL, '1', '2023-05-01', GETDATE());


-- Insertar registros en la tabla 'clientes'
INSERT INTO dbo.clientes (
    dni_cliente, 
    razon_social_cliente, 
    representante_cliente, 
    clave_cliente, 
    id_vendedor_usuario_cliente, 
    limite_credito_cliente, 
    alerta_credito_cliente, 
    ubigeo_cliente, 
    direccion_cliente, 
    referencias_cliente, 
    contacto_cliente, 
    telefono_cliente, 
    email_cliente, 
    area_cliente, 
    logo_cliente, 
    id_creador_cliente, 
    estado, 
    fecha_creado, 
    fecha_actualizado
)
VALUES 
('12345678901', 'Empresa A', 'José Pérez', 'claveEmpresaA', 1, 10000.0000, 8000.0000, 10101, 'Av. Principal 123', 'Cerca de la plaza', 'José Pérez', '987654321', 'empresaA@example.com', 'Ventas', 'logoA.jpg', NULL, '1', '2023-01-15', GETDATE()),
('23456789012', 'Empresa B', 'Marta Sánchez', 'claveEmpresaB', 2, 15000.0000, 12000.0000, 10102, 'Calle Secundaria 456', 'Frente al parque', 'Marta Sánchez', '976543210', 'empresaB@example.com', 'Marketing', 'logoB.jpg', NULL, '1', '2023-02-20', GETDATE()),
('34567890123', 'Empresa C', 'Luis Ramírez', 'claveEmpresaC', 3, 5000.0000, 4000.0000, 10103, 'Jr. Tercero 789', 'Al lado del banco', 'Luis Ramírez', '965432109', 'empresaC@example.com', 'IT', 'logoC.jpg', NULL, '1', '2023-03-10', GETDATE()),
('45678901234', 'Empresa D', 'Ana Torres', 'claveEmpresaD', 4, 20000.0000, 15000.0000, 10104, 'Av. Central 101', 'Cerca del centro comercial', 'Ana Torres', '954321098', 'empresaD@example.com', 'Recursos Humanos', 'logoD.jpg', NULL, '1', '2023-04-05', GETDATE()),
('56789012345', 'Empresa E', 'Carlos Gutiérrez', 'claveEmpresaE', 5, 8000.0000, 6000.0000, 10105, 'Calle Cuarta 202', 'Detrás del museo', 'Carlos Gutiérrez', '943210987', 'empresaE@example.com', 'Logística', 'logoE.jpg', NULL, '1', '2023-05-25', GETDATE());


-- Insertar registros en la tabla 'ubigeo'
INSERT INTO dbo.ubigeo (UBIGEO, DEPARTAMENTO, PROVINCIA, DESTINO, Zona, id)
VALUES 
(10101, 'AMAZONAS', 'CHACHAPOYAS', 'ASUNCION', 'ORIENTE', NULL),
(10102, 'AMAZONAS', 'CHACHAPOYAS', 'BALSAS', 'ORIENTE', NULL),
(10103, 'AMAZONAS', 'CHACHAPOYAS', 'CHETO', 'ORIENTE', NULL),
(10104, 'AMAZONAS', 'CHACHAPOYAS', 'CHILIQUIN', 'ORIENTE', NULL),
(10105, 'AMAZONAS', 'CHACHAPOYAS', 'CHUQUIBAMBA', 'ORIENTE', NULL);


-- Insertar registros en la tabla 'distritos'
INSERT INTO dbo.distritos (nombre_dist, ubigeo, provincia_id)
VALUES 
('CHACHAPOYAS', '10101', 1),
('ASUNCION', '10102', 1),
('BALSAS', '10103', 1),
('CHETO', '10104', 1),
('CHILIQUIN', '10105', 1);


-- Insertar registros en la tabla 'departamentos'
INSERT INTO dbo.departamentos (nombre_dep, ubigeo, pais_id, activo, created_at, updated_at, deleted_at)
VALUES 
('AMAZONAS', '01', 1, 1, '2021-07-12 11:37:06', '2021-07-12 10:58:14', NULL),
('ANCASH', '02', 1, 1, '2021-07-12 11:37:06', '2021-07-12 11:37:06', NULL),
('APURIMAC', '03', 1, 1, '2021-07-12 11:37:06', '2021-07-12 11:37:06', NULL),
('AREQUIPA', '04', 1, 1, '2021-07-12 11:37:06', '2021-07-12 11:37:06', NULL),
('AYACUCHO', '05', 1, 1, '2021-07-12 11:37:06', '2021-07-12 11:37:06', NULL);


-- Insertar registros en la tabla 'provincias'
INSERT INTO dbo.provincias (nombre_prov, ubigeo, departamento_id)
VALUES 
('CHACHAPOYAS', '010100', 1),
('BAGUA', '010200', 1),
('BONGARA', '010300', 1),
('CONDORCANQUI', '010400', 1),
('LUYA', '010500', 1);