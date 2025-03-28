const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO usuaris (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        res.json(newUser.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM usuaris WHERE email = $1', [email]);
        if (user.rows.length === 0) return res.status(401).json({ error: 'Usuari no trobat' });

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(401).json({ error: 'Contrasenya incorrecta' });

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};