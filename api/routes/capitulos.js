const express = require('express');
const router = express.Router();
const capitulosController = require('../controllers/capitulosController');
const authenticateToken = require('../middlewares/authenticateToken');

// Rutas de capítulos
router.get('/', authenticateToken, capitulosController.listarCapitulos); // Esta es para obtener todos los capítulos, si necesitas esta ruta sin paginación
router.get('/paginados', authenticateToken, capitulosController.listarCapitulosPaginados); // Esta es para obtener los capítulos paginados
router.get('/:id', authenticateToken, capitulosController.obtenerCapitulo);
router.put('/:id/marcarleido', authenticateToken, capitulosController.marcarCapituloLeido);
router.put('/:id/marcarnoleido', authenticateToken, capitulosController.marcarNoLeido);

module.exports = router;
