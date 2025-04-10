// Middleware per autenticar usuaris amb jwt

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    console.log("Token rebut:", token);
    if (!token) return res.status(401).json({ error: 'Accés denegat' });

    try {
        console.log(process.env.JWT_SECRET)
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Token no vàlid' });
    }
};