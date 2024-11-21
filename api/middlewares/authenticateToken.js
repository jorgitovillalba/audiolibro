const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(' ')[1] : authHeader;

    if (!token) {
        console.log("Token no proporcionado en el encabezado de autorización.");
        return res.status(403).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Error de verificación de token:", err);
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
