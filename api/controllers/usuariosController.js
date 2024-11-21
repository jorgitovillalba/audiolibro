const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');  // Asegúrate de que esta sea tu configuración de DB


const registrarUsuario = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;

        // Verifica si el usuario ya existe en la base de datos
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

        if (rows.length > 0) {
            return res.status(400).json({ mensaje: 'El usuario ya está registrado' });
        }

        // Encripta la contraseña
        const saltRounds = 10;
        const contrasenaEncriptada = await bcrypt.hash(contrasena, saltRounds);

        // Inserta el nuevo usuario en la base de datos con la contraseña encriptada
        await pool.query('INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)', [usuario, contrasenaEncriptada]);

        res.json({ mensaje: 'Usuario registrado con éxito' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

// En controllers/usuariosController.js

const iniciarSesion = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;

        // Busca el usuario en la base de datos
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

        if (rows.length === 0) {
            return res.status(401).json({ mensaje: 'Usuario no encontrado' });
        }

        const usuarioEncontrado = rows[0];

        // Compara la contraseña ingresada con la almacenada en la base de datos
        const esContrasenaCorrecta = await bcrypt.compare(contrasena, usuarioEncontrado.contrasena);

        if (!esContrasenaCorrecta) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        // Genera el token JWT
        const token = jwt.sign(
            { id: usuarioEncontrado.id, usuario: usuarioEncontrado.usuario },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // El token expira en 1 hora
        );

        // Devuelve el token al cliente
        res.json({ mensaje: 'Inicio de sesión exitoso', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = {
    registrarUsuario,
    iniciarSesion
};
