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

app.get("/getPosts", (req, res) => {
    const sql = 'SELECT posts.id_publicacion, posts.tipo_publicacion, posts.mensaje, posts.fecha_creacion, posts.imagen_base64, users.nombre_completo AS nombre_usuario, users.facultad, users.carrera, professors.nombre_catedratico, courses.nombre_curso FROM posts INNER JOIN users ON posts.carnet = users.carnet LEFT JOIN professors ON posts.id_catedratico = professors.id_catedratico LEFT JOIN courses ON posts.id_curso = courses.id_curso'
    db.query(sql, (error, results) => {
      if (error) {
        console.error('Error en la consulta: ' + error.stack);
        res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        return;
      }

      res.json(results);
    });
});

app.get("/getComments/:postId", (req, res) => {
    const postId = req.params.postId;
    const sql = 'SELECT comments.id_comentario, comments.comentario, comments.fecha_creacion, users.nombre_completo AS nombre_usuario, users.facultad, users.carrera FROM comments INNER JOIN users ON comments.carnet = users.carnet WHERE comments.id_publicacion = ?';
    db.query(sql, [postId], (err, results) => {
        if (err) {
            console.error('Error al obtener los comentarios:', err);
            return res.status(500).json({ error: 'Error al obtener los comentarios.' });
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
    let sql, values;    
    if (newPost.tipo_publicacion === 'Curso') {
        sql = 'INSERT INTO posts (carnet, tipo_publicacion, id_curso, mensaje, imagen_base64) VALUES (?, ?, ?, ?, ?)';
        values = [newPost.carnet, newPost.tipo_publicacion, newPost.id, newPost.mensaje, newPost.imagen];
    } else if (newPost.tipo_publicacion === 'Catedrático') {
        sql = 'INSERT INTO posts (carnet, tipo_publicacion, id_catedratico, mensaje, imagen_base64) VALUES (?, ?, ?, ?, ?)';
        values = [newPost.carnet, newPost.tipo_publicacion, newPost.id, newPost.mensaje, newPost.imagen];
    }

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al crear el post:', err);
            return res.status(500).json({ response: 'Error al crear el post.' });
        }

        res.status(201).json({ response: 'Post creado exitosamente.' });
    });
});

app.post("/newComment", (req, res) => {
    const newComment = req.body;
    const sql = 'INSERT INTO comments (id_publicacion, carnet, comentario) VALUES (?, ?, ?)'
    const values = [newComment.id_publicacion, newComment.carnet, newComment.comentario];   
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al crear el comentario:', err);
            return res.status(500).json({ response: 'Error al crear el comentario.' });
        }

        res.status(201).json({ response: 'Comentario creado exitosamente.' });
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