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

app.post("/newUser", (req, res) => {
    const newUser = req.body;
    const sql = 'INSERT INTO users (carnet, nombre_completo, genero, facultad, carrera, correo, contrasenia) VALUES (?, ?, ?, ?, ?, ?, ?)';
    console.log(newUser);
    db.query(sql, [newUser.carnet, `${newUser.nombres} ${newUser.apellidos}`, newUser.genero, newUser.facultad, newUser.carrera, newUser.correo, newUser.contrasenia], (err, result) => {
        if (err) {
            res.status(500).send({ response: "Error al crear usuario." });
        } else {
            res.status(201).send({ response: "Usuario creado correctamente." });
        }
    });
});

app.post("/login", (req, res) => {
    const data = req.body;
    console.log(data);

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
            return res.status(404).send(response);
        } else {
            const response = {
                success: true,
                user: results[0],
            };
            return res.json(response);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});