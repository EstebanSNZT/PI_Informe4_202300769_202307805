const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(bodyParser.json({ limit: '80mb' }));
app.use(bodyParser.urlencoded({ limit: '80mb', extended: true }));
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"]
    })
);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});