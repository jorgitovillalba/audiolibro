// controllers/capitulosController.js
const db = require('../config/db');

exports.listarCapitulos = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const [capitulos] = await db.query(`
            SELECT c.id, c.numero
            FROM capitulos c
            LEFT JOIN estado_lectura el ON c.id = el.capitulo_id AND el.usuario_id = ?
            WHERE el.estado IS NULL OR el.estado = 'no leído'
            ORDER BY c.id
            LIMIT ? OFFSET ?
        `, [userId, limit, offset]);

        res.json(capitulos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener capítulos" });
    }
};

// controllers/capitulosController.js

// En controllers/capitulosController.js
exports.listarCapitulosPaginados = async (req, res) => {
    const limit = parseInt(req.query.limit) || 30;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const userId = req.user.userId;
        const [capitulos] = await db.query(`
            SELECT c.id, c.numero, COALESCE(el.estado, 'no leído') AS estado, contenido
            FROM capitulos c
            LEFT JOIN estado_lectura el ON c.id = el.capitulo_id AND el.usuario_id = ?
            LIMIT ? OFFSET ?
        `, [userId, limit, offset]);

        res.json(capitulos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener capítulos paginados" });
    }
};


exports.obtenerCapitulo = async (req, res) => {
    const { id } = req.params;
    try {
        const [capitulo] = await db.query("SELECT id, numero, contenido FROM capitulos WHERE id = ?", [id]);
        if (capitulo.length === 0) return res.status(404).json({ error: "Capítulo no encontrado" });
        res.json(capitulo[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el capítulo" });
    }
};

exports.marcarCapituloLeido = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const { id } = req.params;
        const userId = req.user.id;

        const [result] = await db.query(
            `INSERT INTO estado_lectura (usuario_id, capitulo_id, estado) VALUES (?, ?, 'leído')
             ON DUPLICATE KEY UPDATE estado = 'leído'`,
            [userId, id]
        );

        res.json({ mensaje: 'Capítulo marcado como leído con éxito.' });

    } catch (error) {
        console.error('Error al marcar capítulo como leído:', error);
        res.status(500).json({ error: 'Error al marcar capítulo como leído', detalles: error.message });
    }
};

exports.marcarNoLeido = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const { id } = req.params;
        const userId = req.user.id;

        const [result] = await db.query(
            `INSERT INTO estado_lectura (usuario_id, capitulo_id, estado) VALUES (?, ?, 'no leído')
             ON DUPLICATE KEY UPDATE estado = 'no leído'`,
            [userId, id]
        );

        res.json({ mensaje: 'Capítulo marcado como no leído con éxito.' });

    } catch (error) {
        console.error('Error al marcar capítulo como no leído:', error);
        res.status(500).json({ error: 'Error al marcar capítulo como no leído', detalles: error.message });
    }
};

