const mailer = require('./mailer');
const cron = require('node-cron');
const pool = require('../db');

async function detecterAlertes() {
    try {
        console.log('🔍 Vérification des températures...');

        // 1. Récupérer tous les frigos avec leur seuil max
        const frigos = await pool.query(`
            SELECT id, nom_frigo, seuil_max FROM Entrepot
        `);

        for (const frigo of frigos.rows) {

            // 2. Chercher les températures hors seuil depuis 5 min
            const result = await pool.query(`
                SELECT COUNT(*) as nb
                FROM Historique
                WHERE id_frigo = $1
                AND valeur_temp > $2
                AND date_heure >= NOW() - INTERVAL '5 minutes'
            `, [frigo.id, frigo.seuil_max]);

            const nbHorsSeuil = parseInt(result.rows[0].nb);

            if (nbHorsSeuil > 0) {

                // 3. Vérifier s'il y a déjà une alerte ouverte
                const alerteExistante = await pool.query(`
                    SELECT id FROM alerts
                    WHERE id_frigo = $1
                    AND statut = 'open'
                `, [frigo.id]);

                if (alerteExistante.rows.length === 0) {

                    // 4. Déterminer le niveau (warning ou critical)
                    const derniereTemp = await pool.query(`
                        SELECT valeur_temp FROM Historique
                        WHERE id_frigo = $1
                        ORDER BY date_heure DESC LIMIT 1
                    `, [frigo.id]);

                    const temp    = derniereTemp.rows[0].valeur_temp;
                    const niveau  = temp > frigo.seuil_max + 2 ? 'critical' : 'warning';
                    const message = `Température ${temp}°C détectée (seuil : ${frigo.seuil_max}°C)`;

                    // 5. Créer l'alerte en base
                    await pool.query(`
                        INSERT INTO alerts (id_frigo, niveau, message)
                        VALUES ($1, $2, $3)
                    `, [frigo.id, niveau, message]);

                    console.log(`🚨 Alerte ${niveau} créée pour ${frigo.nom_frigo}`);

                    // TODO: Envoyer email si critical
                }
            }
        }
    } catch (err) {
        console.error('❌ Erreur détection :', err);
    }
}

// Lancer la détection toutes les 5 minutes
cron.schedule('*/5 * * * *', () => {
    detecterAlertes();
});

// Lancer une première fois au démarrage
detecterAlertes();

module.exports = { detecterAlertes };