const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {

    const authHeader = req.headers['authorization'];
  
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {

        return res.status(401).json({ error: 'Token manquant, accès refusé' });

    }

    try {

        const decoded = jwt.verify(token, JWT_SECRET);
        
        req.user = decoded;

        next();

    } catch (e) {

        return res.status(401).json({ error: 'Token invalide ou expiré' });

    }
}

module.exports = authMiddleware;
