const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// GET toutes les alertes
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT a.*, e.nom_frigo
            FROM alerts a
            JOIN Entrepot e ON a.id_frigo = e.id
            ORDER BY a.date_debut DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ erreur: err.message });
    }
});

// PATCH résoudre une alerte
router.patch('/:id/resolve', async (req, res) => {
    try {
        const result = await pool.query(`
            UPDATE alerts
            SET statut = 'resolved',
                date_resolution = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ erreur: 'Alerte non trouvée' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ erreur: err.message });
    }
});

module.exports = router;