// routes/usuarios.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.post('/registrarse', usuariosController.registrarUsuario);
router.post('/iniciar-sesion', usuariosController.iniciarSesion);

module.exports = router;
