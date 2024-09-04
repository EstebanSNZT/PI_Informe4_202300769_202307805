const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment/moment');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;
const FILEUSERS = 'users.json';
const FILEPOSTS = 'posts.json';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'milo$ekiro12',
    database: 'storage'
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
    console.log('Conectado a la base de datos.');
});

const adminUser = {
    codigo: 202300769,
    nombres: "Esteban",
    apellidos: "Sánchez Túchez",
    genero: "M",
    facultad: "Ingeniería",
    carrera: "Ingeniería en Ciencias y Sistemas",
    correo: "esteban07sánchez@hgmail.com",
    contrasenia: "@dmin"
}

if (!fs.existsSync(FILEUSERS)) {
    fs.writeFileSync(FILEUSERS, JSON.stringify(dataUsers));
} else {
    const fileData = fs.readFileSync(FILEUSERS, 'utf8');
    dataUsers = JSON.parse(fileData);
}

if (!fs.existsSync(FILEPOSTS)) {
    fs.writeFileSync(FILEPOSTS, JSON.stringify(dataPosts));
} else {
    const fileData = fs.readFileSync(FILEPOSTS, 'utf8');
    dataPosts = JSON.parse(fileData);
}

function updatedUsersDataFiles() {
    fs.writeFileSync(FILEUSERS, JSON.stringify(dataUsers));
}

function updatedPostsDataFiles() {
    fs.writeFileSync(FILEPOSTS, JSON.stringify(dataPosts));
}

app.get("/getUsers", (req, res) => {
    res.json(dataUsers);
});

app.post("/users", (req, res) => {
    const { codigo, nombres, apellidos, genero, facultad, carrera, correo, contrasenia } = req.body;
    const sql = 'INSERT INTO users (codigo, nombres, apellidos, genero, facultad, carrera, correo, contrasenia) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [codigo, nombres, apellidos, genero, facultad, carrera, correo, contrasenia], (err, result) => {
        if (err) {
            res.status(500).send({ response: "Error al crear usuario." });
        } else {
            res.status(201).send({ response: "Usuario creado correctamente." });
        }
    });
});

app.get("/users/:codigo", (req, res) => {
    const codigo = req.params.codigo;
    const user = dataUsers.find(user => user.codigo === codigo);
    if (!user) {
        res.status(404).send({ response: "Usuario no encontrado" });
    } else {
        res.json(user);
    }
});

app.put("/editUser", (req, res) => {
    const editedUser = req.body;
    const codigo = editedUser.codigo;
    const index = dataUsers.findIndex(user => user.codigo === codigo);
    if (index === -1) {
        const response = {
            success: false,
            user: null
        }
        res.status(404).send(response);
    } else {
        dataUsers[index].nombres = editedUser.nombres;
        dataUsers[index].apellidos = editedUser.apellidos;
        dataUsers[index].genero = editedUser.genero;
        dataUsers[index].facultad = editedUser.facultad;
        dataUsers[index].carrera = editedUser.carrera;
        dataUsers[index].correo = editedUser.correo;
        if (editedUser.contrasenia !== "") {
            dataUsers[index].contrasenia = editedUser.contrasenia;
        }
        updatedUsersDataFiles();
        const response = {
            success: true,
            user: dataUsers[index],
        }
        res.json(response);
    }
});

app.post("/uploadUsers", (req, res) => {
    const newUsers = req.body;
    let newUsersDataTable = [];
    var numberUserNotUploaded = 0;
    newUsers.map((newUser) => {

        const isCodeRepeat = dataUsers.find(user => {
            if (user.codigo === newUser.codigo) {
                return true;
            }
        });

        if (!isCodeRepeat) {
            dataUsers.push(newUser);
            newUsersDataTable.push(newUser);
        } else {
            numberUserNotUploaded++;
        }
    });
    updatedUsersDataFiles();
    const message = {
        body: newUsersDataTable,
        response: `${newUsersDataTable.length} usuario(s) agradado(s) con exito, ${numberUserNotUploaded} usuario(s) no agragado(s)`
    }
    res.send(message);
});

app.post("/uploadPosts", (req, res) => {
    const newPosts = req.body;
    let newPostsDataTable = [];
    var numberPostsNotUploaded = 0;
    const date = moment().format('D/MM/YYYY HH:mm');
    newPosts.map((newPost) => {

        const userExists = dataUsers.find(user => {
            if (user.codigo === newPost.codigo) {
                return true;
            }
        });

        if (userExists) {
            const postUploaded = {
                id: (dataPosts.length + 1),
                codigo: newPost.codigo,
                descripcion: newPost.descripcion,
                categoria: newPost.categoria,
                imagen: "",
                anonimo: newPost.anonimo,
                likes: [],
                comentarios: [],
                fecha: date
            };
            dataPosts.push(postUploaded);
            newPostsDataTable.push(postUploaded);
        } else {
            numberPostsNotUploaded++;
        }
    });
    updatedPostsDataFiles();
    const message = {
        body: newPostsDataTable,
        response: `${newPostsDataTable.length} post(s) agradado(s) con exito, ${numberPostsNotUploaded} post(s) no agragado(s)`
    }
    res.send(message);
});

app.delete("/deleteMyUser", (req, res) => {
    const codigo = 202300769;
    const index = dataUsers.findIndex(user => user.codigo === codigo);
    dataUsers.splice(index, 1);
    updatedUsersDataFiles();
    res.json({response: `Usuario eliminado: ${codigo}`});
});

app.delete("/deleteUser/:code", (req, res) => {
    const codigo = parseInt(req.params.code);
    const index = dataUsers.findIndex(user => user.codigo === codigo);
    if (index === -1) {
        const message = {
            success: false,
            response: "Usuario no encontrado.",
        }
        res.status(404).send(message);
    } else {
        var numberPostEliminated = 0;
        dataPosts.map((post) => {
            if (post.codigo === codigo) {
                dataPosts.splice(dataPosts.indexOf(post), 1);
                updatedPostsDataFiles();
                numberPostEliminated++;
            }
        })
        dataUsers.splice(index, 1);
        updatedUsersDataFiles();
        const message = {
            success: true,
            response: "Usuario eliminado correctamente.",
            numberPostEliminated: `Numero de Post del Usuario Eliminados: ${numberPostEliminated}`
        }
        res.send(message);
    }
});



app.post("/login", (req, res) => {
    const data = req.body;
    console.log(data);

    const user = dataUsers.find(user => {
        if (user.codigo === data.codigo && user.contrasenia === data.contrasenia) {
            return user;
        }
    });
    if (!user) {
        const admUser = (adminUser.codigo === data.codigo) ? adminUser : null;
        if (!admUser) {
            const response = {
                success: false,
                user: null
            };
            res.status(404).send(response);
        } else {
            const response = {
                success: true,
                user: admUser,
                type: 0
            };
            res.json(response);
        }
    } else {
        const response = {
            success: true,
            user: user,
            type: 1
        };
        res.json(response);
    }
});

app.get("/getPostsAdmin", (req, res) => {
    res.json(dataPosts);
});

app.get('/getCategoryReports', (req, res) => {
    const reports = {};
    dataPosts.forEach(post => {
        if (reports.hasOwnProperty(post.categoria)) {
            reports[post.categoria]++;
        } else {
            reports[post.categoria] = 1;
        }
    });
    const reportsArray = Object.entries(reports).map(([nombre, posts]) => ({ nombre, posts }));
    res.json(reportsArray);
})

app.get('/getUsersReports', (req, res) => {
    let reportsArray = [];
    const reports = {};
    dataPosts.forEach(post => {
        if (reports.hasOwnProperty(post.codigo)) {
            reports[post.codigo]++;
        } else {
            reports[post.codigo] = 1;
        }
    });
    const reportsArrayWithouName = Object.entries(reports).map(([codigo, posts]) => ({ codigo, posts }));

    reportsArrayWithouName.map((report) => {
        const user = dataUsers.find(user => user.codigo === parseInt(report.codigo));
        reportsArray.push({
            nombres: user.nombres,
            apellidos: user.apellidos,
            codigo: parseInt(report.codigo),
            posts: report.posts
        });
    });
    res.json(reportsArray);
})

app.get("/getPostsUsers", (req, res) => {
    let posts = [];
    dataPosts.map((item) => {
        const user = dataUsers.find(user => user.codigo === item.codigo);
        let comments = [];

        item.comentarios.map((comment) => {
            const userComment = dataUsers.find(user => user.codigo === comment.codigo);

            comments.push({
                usuario: userComment,
                comentario: comment.comentario,
                fecha: comment.fecha
            })
        })

        posts.push({
            usuario: user,
            id: item.id,
            descripcion: item.descripcion,
            categoria: item.categoria,
            imagen: item.imagen,
            anonimo: item.anonimo,
            likes: item.likes,
            comentarios: comments,
            fecha: item.fecha
        })
    })
    res.json(posts);
});

app.post("/createPost", (req, res) => {
    const date = moment().format('D/MM/YYYY HH:mm');
    const newPost = req.body;
    const savePost = {
        id: (dataPosts.length + 1),
        codigo: newPost.codigo,
        descripcion: newPost.descripcion,
        categoria: newPost.categoria,
        imagen: newPost.imagen,
        anonimo: newPost.anonimo,
        likes: [],
        comentarios: [],
        fecha: date
    }
    dataPosts.push(savePost);
    updatedPostsDataFiles();
    res.status(201).send({ response: "Post creado correctamente." });
});

app.delete("/deletePost/:idPost", (req, res) => {
    const id = parseInt(req.params.idPost);
    console.log(id);
    const index = dataPosts.findIndex(post => post.id === id);
    if (index === -1) {
        res.status(404).send({ response: "Post no encontrado." });
    } else {
        dataPosts.splice(index, 1);
        updatedPostsDataFiles();
        res.send({ response: "Post eliminado correctamente." });
    }
});

app.post("/commentPost", (req, res) => {
    const date = moment().format('D/MM/YYYY HH:mm');
    const newComment = req.body;
    const index = dataPosts.findIndex(post => post.id === newComment.postId);
    const saveComment = {
        comentario: newComment.comentario,
        codigo: newComment.codigo,
        fecha: date
    }
    console.log(saveComment);
    dataPosts[index].comentarios.push(saveComment);
    updatedPostsDataFiles();
    res.status(201).send({ response: "Comentario agregado correctamente." });
});

app.post("/likePost", (req, res) => {
    const postLike = req.body;
    const index = dataPosts.findIndex(post => post.id === postLike.id);
    if (postLike.liked) {
        dataPosts[index].likes.push(postLike.codigo);
        updatedPostsDataFiles();
        res.status(201).send({ response: "Like agregado correctamente." });
    } else if (!postLike.liked) {
        const indexLike = dataPosts[index].likes.findIndex(codigo => codigo === postLike.codigo);
        dataPosts[index].likes.splice(indexLike, 1);
        updatedPostsDataFiles();
        res.status(201).send({ response: "Like eliminado correctamente." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});