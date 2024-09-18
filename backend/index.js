const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment/moment');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'default_user',
    password: '',
    database: 'db_users'
});

app.use(bodyParser.json({ limit: '80mb' }));
app.use(bodyParser.urlencoded({ limit: '80mb', extended: true }));
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"]
    })
);

db.connect(err => {
    if (err) {
        console.error('Error conectado a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

app.get("/getUsers", (req, res) => {
    const sql = 'SELECT * FROM users'
    db.query(sql, (error, results) => {
      if (error) {
        console.error('Error en la consulta: ' + error.stack);
        res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        return;
      }

      res.json(results);
    });
});

app.get("/getProfessors", (req, res) => {
    const sql = 'SELECT * FROM professors'
    db.query(sql, (error, results) => {
      if (error) {
        console.error('Error en la consulta: ' + error.stack);
        res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        return;
      }
      res.json(results);
    });
});

app.get("/getCourses", (req, res) => {
    const sql = 'SELECT * FROM courses'
    db.query(sql, (error, results) => {
      if (error) {
        console.error('Error en la consulta: ' + error.stack);
        res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        return;
      }

      res.json(results);
    });
});

app.post("/newUser", (req, res) => {
    const newUser = req.body;
    const values = [newUser.carnet, `${newUser.nombres} ${newUser.apellidos}`, newUser.genero, newUser.facultad, newUser.carrera, newUser.correo, newUser.contrasenia]
    const sql = 'INSERT INTO users (carnet, nombre_completo, genero, facultad, carrera, correo, contrasenia) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al crear el usuario:', err);
            return res.status(500).json({ response: "Error al crear el usuario." });
        }
        res.status(201).json({ response: "Usuario creado correctamente." });
    });
});

app.post("/newPost", (req, res) => {
    const newPost = req.body;
    
    if (newPost.tipo_publicacion === 'Curso') {
        sql = 'INSERT INTO posts (carnet, tipo_publicacion, id_curso, mensaje) VALUES (?, ?, ?, ?)';
        values = [newPost.carnet, newPost.tipo_publicacion, newPost.id_curso, newPost.mensaje];
    } else if (newPost.tipo_publicacion === 'Catedratico') {
        sql = 'INSERT INTO posts (carnet, tipo_publicacion, id_catedratico, mensaje) VALUES (?, ?, ?, ?)';
        values = [newPost.carnet, newPost.tipo_publicacion, newPost.id_catedratico, newPost.mensaje];
    }

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al crear el post:', err);
            return res.status(500).json({ success: false, message: 'Error al crear el post.' });
        }

        res.status(201).json({ success: true, message: 'Post creado exitosamente.' });
    });
});

app.post("/login", (req, res) => {
    const data = req.body;
    const sql = 'SELECT * FROM users WHERE carnet = ? AND contrasenia = ?';

    db.query(sql, [data.carnet, data.contrasenia], (err, results) => {
        if (err) {
            return res.status(500).send({ success: false, message: "Error en la consulta de base de datos." });
        }

        if (results.length === 0) {
            const response = {
                success: false,
                user: null
            };
            res.status(404).send(response);
        } else {
            const response = {
                success: true,
                user: results[0],
            };
            res.json(response);
        }
    });
});

app.put("/recoverPassword", (req, res) => {
    const data= req.body;

    const sqlUpdate = 'UPDATE users SET contrasenia = ? WHERE carnet = ? AND correo = ?';
    db.query(sqlUpdate, [data.nuevaContrasenia, data.carnet, data.correo], (err, result) => {
        
        if (err) {
            console.error('Error en la consulta de la base de datos: ' + err.stack);
            return res.status(500).json({ success: false, message: 'Error en la consulta de la base de datos.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }

        res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente.' });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});