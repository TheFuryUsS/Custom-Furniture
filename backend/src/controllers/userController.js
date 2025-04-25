const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');


// User register
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        res.json(newUser.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// User login
exports.loginUser = async (req, res) => {
    const { username_or_email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1 or username = $1', [username_or_email]);
        if (user.rows.length === 0) return res.status(401).json({ error: 'Usuari no trobat' });

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(401).json({ error: 'Contrassenya incorrecta' });

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get de tots els usuaris
exports.getAllUsers = async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT * FROM users'
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Error al obtenir usuaris:', err);
      res.status(500).json({ error: 'Error al obtenir usuaris' });
    }
  };