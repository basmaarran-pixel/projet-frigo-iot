const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// GET historique d'un frigo avec filtres date
router.get('/:id/history', async (req, res) => {
    try {
        const { from, to } = req.query;
        const { id }       = req.params;

        // Valeurs par défaut : dernières 24h
        const dateFrom = from || new Date(Date.now() - 86400000).toISOString();
        const dateTo   = to   || new Date().toISOString();

        const result = await pool.query(`
            SELECT valeur_temp, date_heure
            FROM Historique
            WHERE id_frigo = $1
            AND date_heure BETWEEN $2 AND $3
            ORDER BY date_heure ASC
        `, [id, dateFrom, dateTo]);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ erreur: err.message });
    }
});

module.exports = router;