CREATE DATABASE IF NOT EXISTS db_users;

CREATE USER 'default_user'@'localhost' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON db_users.* TO 'default_user'@'localhost';

USE db_users;

CREATE TABLE users (
carnet INT PRIMARY KEY NOT NULL,
nombre_completo VARCHAR(100) NOT NULL,
genero VARCHAR(100),
facultad VARCHAR(100),
carrera VARCHAR(100),
correo VARCHAR(100) UNIQUE NOT NULL,
contrasenia VARCHAR(100) NOT NULL,
fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses(
id_curso INT PRIMARY KEY NOT NULL,
nombre_curso VARCHAR(200) NOT NULL,
creditos INT NOT NULL
);

CREATE TABLE professors(
id_catedratico INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
nombre_catedratico VARCHAR(250) NOT NULL
);

CREATE TABLE posts(
id_publicacion INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
carnet INT,
tipo_publicacion ENUM("Curso", "Catedratico"),
id_curso INT,
id_catedratico INT,
mensaje TEXT NOT NULL,
fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (carnet) REFERENCES users(carnet),
FOREIGN KEY (id_curso) REFERENCES courses(id_curso),
FOREIGN KEY (id_catedratico) REFERENCES professors(id_catedratico)
);

CREATE TABLE comments(
id_comentario INT PRIMARY KEY AUTO_INCREMENT,
id_publicacion INT,
carnet INT,
comentario TEXT NOT NULL,
fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (carnet) REFERENCES users(carnet),
FOREIGN KEY (id_publicacion) REFERENCES posts(id_publicacion)
);