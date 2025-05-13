const pool = require('../config/db');

// Obtenir tots els dissenys de l'usuari
exports.getAllDesigns = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'SELECT * FROM designs WHERE user_id = $1 ORDER BY created_at DESC', [userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtenir els dissenys' });
    }
};

// Obtenir un disseny concret
exports.getDesignById = async (req, res) => {
    const userId = req.user.id;
    const designId = req.params.id;

    try {
        const result = await pool.query(
            'SELECT * FROM designs WHERE id = $1 AND user_id = $2',
            [designId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Disseny no trobat' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtenir el disseny' });
    }
};

// Crear un nou disseny
exports.createDesign = async (req, res) => {
    const userId = req.user.id;
    const { name, data, type } = req.body; // data en format JSON

    try {
        const result = await pool.query(
            'INSERT INTO designs (user_id, name, data, type) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, name, data, type]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el disseny' });
    }
};


// Esborrar un disseny
exports.deleteDesign = async (req, res) => {
    const userId = req.user.id;
    const designId = req.params.id;

    try {
        await pool.query(
            'DELETE FROM designs WHERE id = $1 AND user_id = $2',
            [designId, userId]
        );
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Error al esborrar el disseny' });
    }
};


// Actualitzar nom disseny
exports.updateDesign = async (req, res) => {
    const userId = req.user.id;
    const designId = req.params.id;
    const { name, data, type } = req.body;

    try {
        const result = await pool.query(`UPDATE designs
            SET name = COALESCE($1, name),
            data = COALESCE($2, data),
            type = COALESCE($3, type)
            WHERE id = $4 AND user_id = $5
            RETURNING *`,
            [name, data, type, designId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Disseny no trobat' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error actualitzant el disseny:', err);
        res.status(500).json({ error: 'Error al actualitzar el disseny' });
    }
};
