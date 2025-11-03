-- =====================================================
-- BASE DE DATOS COMPLETA CON MEJORAS
-- db_alumnoss - Sistema Académico Multi-Institución
-- =====================================================

DROP DATABASE IF EXISTS db_alumnoss;
CREATE DATABASE db_alumnoss CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_alumnoss;

-- =====================================================
-- TABLA: instituciones
-- =====================================================
CREATE TABLE instituciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL UNIQUE,
  direccion VARCHAR(255),
  correo VARCHAR(200),
  localidad VARCHAR(100),
  INDEX idx_nombre (nombre)
) ENGINE=InnoDB;

-- =====================================================
-- TABLA: profesores (CON institucion_id y especialidad)
-- =====================================================
CREATE TABLE profesores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  apellido VARCHAR(200) NOT NULL,
  dni VARCHAR(50) NOT NULL UNIQUE,
  institucion_id INT NOT NULL,
  especialidad TEXT,
  FOREIGN KEY (institucion_id) REFERENCES instituciones(id) ON DELETE CASCADE,
  INDEX idx_dni (dni),
  INDEX idx_institucion (institucion_id)
) ENGINE=InnoDB;

-- =====================================================
-- TABLA: aulas (curso)
-- =====================================================
CREATE TABLE aulas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  institucion_id INT NOT NULL,
  profesor_id INT,
  grado VARCHAR(50),
  FOREIGN KEY (institucion_id) REFERENCES instituciones(id) ON DELETE CASCADE,
  FOREIGN KEY (profesor_id) REFERENCES profesores(id) ON DELETE SET NULL,
  UNIQUE KEY unique_aula_institucion (nombre, institucion_id),
  INDEX idx_institucion (institucion_id),
  INDEX idx_profesor (profesor_id)
) ENGINE=InnoDB;

-- =====================================================
-- TABLA: materias
-- =====================================================
CREATE TABLE materias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL UNIQUE,
  INDEX idx_nombre (nombre)
) ENGINE=InnoDB;

-- =====================================================
-- TABLA: aula_materia (CON CONSTRAINT UNIQUE)
-- =====================================================
CREATE TABLE aula_materia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aula_id INT NOT NULL,
  materia_id INT NOT NULL,
  profesor_id INT,
  FOREIGN KEY (aula_id) REFERENCES aulas(id) ON DELETE CASCADE,
  FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
  FOREIGN KEY (profesor_id) REFERENCES profesores(id) ON DELETE SET NULL,
  UNIQUE KEY unique_aula_materia (aula_id, materia_id),
  INDEX idx_aula (aula_id),
  INDEX idx_materia (materia_id)
) ENGINE=InnoDB;

-- =====================================================
-- TABLA: alumnos (CON DNI UNIQUE)
-- =====================================================
CREATE TABLE alumnos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  apellido VARCHAR(200) NOT NULL,
  dni VARCHAR(50) NOT NULL UNIQUE,
  edad INT,
  genero VARCHAR(20),
  aula_id INT,
  institucion_id INT NOT NULL,
  FOREIGN KEY (aula_id) REFERENCES aulas(id) ON DELETE SET NULL,
  FOREIGN KEY (institucion_id) REFERENCES instituciones(id) ON DELETE CASCADE,
  INDEX idx_dni (dni),
  INDEX idx_aula (aula_id),
  INDEX idx_institucion (institucion_id)
) ENGINE=InnoDB;

-- =====================================================
-- TABLA: pruebas
-- =====================================================
CREATE TABLE pruebas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aula_materia_id INT NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  fecha DATE,
  peso DECIMAL(5,2) DEFAULT 1.0,
  FOREIGN KEY (aula_materia_id) REFERENCES aula_materia(id) ON DELETE CASCADE,
  INDEX idx_aula_materia (aula_materia_id)
) ENGINE=InnoDB;

-- =====================================================
-- TABLA: notas
-- =====================================================
CREATE TABLE notas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prueba_id INT NOT NULL,
  alumno_id INT NOT NULL,
  nota DECIMAL(5,2),
  FOREIGN KEY (prueba_id) REFERENCES pruebas(id) ON DELETE CASCADE,
  FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
  INDEX idx_prueba (prueba_id),
  INDEX idx_alumno (alumno_id)
) ENGINE=InnoDB;

-- =====================================================
-- DATOS DE EJEMPLO
-- =====================================================

-- Instituciones
INSERT INTO instituciones (nombre, direccion, correo, localidad) VALUES
('Escuela Técnica N°1', 'Av. San Martín 123', 'info@et1.edu.ar', 'San Miguel'),
('Colegio Nacional', 'Córdoba 456', 'contacto@cn.edu.ar', 'Tucumán');

-- Profesores (AHORA CON institucion_id y especialidad)
INSERT INTO profesores (nombre, apellido, dni, institucion_id, especialidad) VALUES
('Carlos', 'Martínez', '12345678', 1, 'Matemática, Física'),
('María', 'Gómez', '23456789', 1, 'Lengua, Literatura'),
('Lucía', 'Pérez', '34567890', 2, 'Historia, Geografía, Inglés'),
('Roberto', 'Díaz', '45678901', 1, 'Química, Biología'),
('Sandra', 'Torres', '56789012', 2, 'Matemática, Inglés');

-- Aulas
INSERT INTO aulas (nombre, institucion_id, profesor_id, grado) VALUES
('1ero A', 1, 1, '1er Año'),
('2do B', 1, 2, '2do Año'),
('3ero A', 2, 3, '3er Año'),
('1ero B', 1, 4, '1er Año'),
('2do A', 2, 5, '2do Año');

-- Materias
INSERT INTO materias (nombre) VALUES 
('Matemática'),
('Lengua'),
('Historia'),
('Inglés'),
('Física'),
('Química'),
('Biología'),
('Geografía');

-- Aula-Materia Assignments
INSERT INTO aula_materia (aula_id, materia_id, profesor_id) VALUES
-- 1ero A (Escuela Técnica N°1)
(1, 1, 1), -- Matemática - Carlos
(1, 2, 2), -- Lengua - María
(1, 3, 1), -- Historia - Carlos
(1, 5, 4), -- Física - Roberto
-- 2do B (Escuela Técnica N°1)
(2, 1, 1), -- Matemática - Carlos
(2, 2, 2), -- Lengua - María
(2, 6, 4), -- Química - Roberto
-- 3ero A (Colegio Nacional)
(3, 1, 3), -- Matemática - Lucía
(3, 2, 3), -- Lengua - Lucía
(3, 4, 3), -- Inglés - Lucía
(3, 3, 3), -- Historia - Lucía
-- 1ero B (Escuela Técnica N°1)
(4, 1, 1), -- Matemática - Carlos
(4, 7, 4), -- Biología - Roberto
-- 2do A (Colegio Nacional)
(5, 1, 5), -- Matemática - Sandra
(5, 4, 5), -- Inglés - Sandra
(5, 8, 3); -- Geografía - Lucía

-- Alumnos (MÁS DE 30 para probar paginación)
INSERT INTO alumnos (nombre, apellido, dni, edad, genero, aula_id, institucion_id) VALUES
-- 1ero A (Escuela Técnica N°1) - 10 alumnos
('Ana', 'González', '30111222', 16, 'Femenino', 1, 1),
('Luis', 'Pérez', '30111223', 17, 'Masculino', 1, 1),
('Carla', 'Sosa', '30111224', 15, 'Femenino', 1, 1),
('Jorge', 'Ruiz', '30111225', 16, 'Masculino', 1, 1),
('Sofía', 'López', '30111226', 16, 'Femenino', 1, 1),
('Mateo', 'Silva', '30111240', 15, 'Masculino', 1, 1),
('Valentina', 'Castro', '30111241', 16, 'Femenino', 1, 1),
('Ignacio', 'Rojas', '30111242', 17, 'Masculino', 1, 1),
('Camila', 'Ortiz', '30111243', 15, 'Femenino', 1, 1),
('Facundo', 'Benítez', '30111244', 16, 'Masculino', 1, 1),
-- 2do B (Escuela Técnica N°1) - 10 alumnos
('Pedro', 'Fernández', '30111227', 17, 'Masculino', 2, 1),
('María', 'Giménez', '30111228', 16, 'Femenino', 2, 1),
('Diego', 'Morales', '30111229', 17, 'Masculino', 2, 1),
('Lucía', 'Núñez', '30111230', 15, 'Femenino', 2, 1),
('Martín', 'Vega', '30111231', 16, 'Masculino', 2, 1),
('Abril', 'Ramírez', '30111245', 16, 'Femenino', 2, 1),
('Santiago', 'Herrera', '30111246', 17, 'Masculino', 2, 1),
('Emma', 'Domínguez', '30111247', 15, 'Femenino', 2, 1),
('Joaquín', 'Flores', '30111248', 16, 'Masculino', 2, 1),
('Catalina', 'Medina', '30111249', 16, 'Femenino', 2, 1),
-- 3ero A (Colegio Nacional) - 8 alumnos
('Valentina', 'Díaz', '30111232', 17, 'Femenino', 3, 2),
('Lucas', 'Ibarra', '30111233', 16, 'Masculino', 3, 2),
('Micaela', 'Ramos', '30111234', 16, 'Femenino', 3, 2),
('Tomás', 'Molina', '30111235', 17, 'Masculino', 3, 2),
('Julieta', 'Suárez', '30111236', 15, 'Femenino', 3, 2),
('Benjamín', 'Álvarez', '30111250', 17, 'Masculino', 3, 2),
('Martina', 'Romero', '30111251', 16, 'Femenino', 3, 2),
('Agustín', 'Vargas', '30111252', 16, 'Masculino', 3, 2),
-- 1ero B (Escuela Técnica N°1) - 7 alumnos
('Renata', 'Cabrera', '30111253', 15, 'Femenino', 4, 1),
('Thiago', 'Navarro', '30111254', 16, 'Masculino', 4, 1),
('Emilia', 'Acosta', '30111255', 15, 'Femenino', 4, 1),
('Lautaro', 'Peralta', '30111256', 16, 'Masculino', 4, 1),
('Agustina', 'Ríos', '30111257', 15, 'Femenino', 4, 1),
('Matías', 'Guzmán', '30111258', 16, 'Masculino', 4, 1),
('Bianca', 'Luna', '30111259', 15, 'Femenino', 4, 1),
-- 2do A (Colegio Nacional) - 5 alumnos
('Dante', 'Bravo', '30111260', 16, 'Masculino', 5, 2),
('Isabella', 'Paredes', '30111261', 17, 'Femenino', 5, 2),
('Nicolás', 'Soto', '30111262', 16, 'Masculino', 5, 2),
('Delfina', 'Campos', '30111263', 16, 'Femenino', 5, 2),
('Máximo', 'Vera', '30111264', 17, 'Masculino', 5, 2);

-- Pruebas
INSERT INTO pruebas (aula_materia_id, nombre, fecha, peso) VALUES
-- 1ero A - Matemática
(1, 'Parcial 1', '2025-03-10', 1.0),
(1, 'Recuperatorio', '2025-03-25', 0.8),
(1, 'Parcial 2', '2025-05-12', 1.0),
-- 1ero A - Lengua
(2, 'Parcial 1', '2025-03-12', 1.0),
(2, 'Trabajo Práctico', '2025-04-08', 0.5),
-- 1ero A - Historia
(3, 'Parcial 1', '2025-03-14', 1.0),
-- 1ero A - Física
(4, 'Parcial 1', '2025-03-15', 1.0),
-- 2do B - Matemática
(5, 'Parcial 1', '2025-03-16', 1.0),
-- 2do B - Lengua
(6, 'Parcial 1', '2025-03-18', 1.0),
-- 2do B - Química
(7, 'Parcial 1', '2025-03-19', 1.0),
-- 3ero A - Matemática
(8, 'Parcial 1', '2025-03-20', 1.0),
-- 3ero A - Lengua
(9, 'Parcial 1', '2025-03-21', 1.0),
-- 3ero A - Inglés
(10, 'Oral Exam', '2025-03-22', 1.0);

-- Notas (sample para varios alumnos)
INSERT INTO notas (prueba_id, alumno_id, nota) VALUES
-- Parcial 1 Matemática 1ero A (prueba_id=1)
(1, 1, 7.5), (1, 2, 6.0), (1, 3, 8.0), (1, 4, 5.5), (1, 5, 9.0),
(1, 6, 6.5), (1, 7, 7.0), (1, 8, 5.0), (1, 9, 8.5), (1, 10, 7.0),
-- Recuperatorio Matemática 1ero A (prueba_id=2)
(2, 1, 6.0), (2, 3, 7.0), (2, 4, 6.5), (2, 8, 6.0),
-- Parcial 2 Matemática 1ero A (prueba_id=3)
(3, 1, 8.0), (3, 2, 7.5), (3, 5, 9.5),
-- Parcial 1 Lengua 1ero A (prueba_id=4)
(4, 1, 7.0), (4, 2, 8.0), (4, 3, 6.0), (4, 4, 7.5),
-- Parcial 1 Matemática 2do B (prueba_id=8)
(8, 11, 8.5), (8, 12, 7.0), (8, 13, 6.5), (8, 14, 9.0), (8, 15, 5.5),
-- Parcial 1 Matemática 3ero A (prueba_id=11)
(11, 21, 8.5), (11, 22, 7.0), (11, 23, 6.0), (11, 24, 5.0), (11, 25, 9.5);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
SELECT 'Base de datos creada exitosamente' AS resultado;
SELECT COUNT(*) AS total_alumnos FROM alumnos;
SELECT COUNT(*) AS total_profesores FROM profesores;
SELECT COUNT(*) AS total_instituciones FROM instituciones;
