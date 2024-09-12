const express = require('express');
const multer = require('multer'); // Middleware para manejar archivos
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors()); // Habilita CORS
app.use(express.json()); // Para manejar datos en formato JSON
app.use(express.urlencoded({ extended: true })); // Para manejar datos de formularios

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada archivo
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // Limitar el tamaño de la imagen a 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Imágenes solo en formato JPEG, PNG o GIF.'));
    }
  }
});

// Datos de prueba en memoria (en lugar de una base de datos real)
let publicaciones = [];

// Ruta para crear una publicación
app.post('/Crearpost', upload.single('imagen'), (req, res) => {
  const { carnet, descripcion, estado, categoria, comentario } = req.body;
  const imagen = req.file ? req.file.filename : null;

  // Validación de datos
  if (!carnet || !descripcion || !categoria) {
    return res.status(400).json({ mensaje: 'Datos incompletos. Asegúrate de enviar carnet, descripción y categoría.' });
  }

  if (!imagen) {
    return res.status(400).json({ mensaje: 'Imagen no válida o faltante.' });
  }

  const nuevaPublicacion = {
    carnet,
    descripcion,
    estado: estado === 'true', // Convierte el estado a booleano
    categoria,
    imagen: `/uploads/${imagen}`,
    comentario: comentario || '', // Asegúrate de que el comentario esté definido
    fecha: new Date()
  };

  publicaciones.push(nuevaPublicacion);

  res.json({ mensaje: 'Publicación creada con éxito', publicacion: nuevaPublicacion });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Ocurrió un error en el servidor.' });
});

// Inicializa el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
