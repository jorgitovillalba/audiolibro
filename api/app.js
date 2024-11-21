const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Permite solicitudes desde el frontend
}));

// Otras configuraciones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/capitulos', require('./routes/capitulos')); 
// ... otras rutas

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
