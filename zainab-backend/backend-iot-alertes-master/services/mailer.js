const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function envoyerAlerte(nomFrigo, temperature, message) {
    try {
        await transporter.sendMail({
            from:    `"Système Frigo IoT" <${process.env.SMTP_USER}>`,
            to:      process.env.SMTP_USER,
            subject: `🚨 ALERTE CRITIQUE — ${nomFrigo}`,
            html: `
                <h2 style="color:red">Alerte critique détectée</h2>
                <p><b>Frigo :</b> ${nomFrigo}</p>
                <p><b>Température :</b> ${temperature}°C</p>
                <p><b>Détail :</b> ${message}</p>
                <p><i>Vérifiez immédiatement l'état du frigo.</i></p>
            `,
        });
        console.log(`📧 Email envoyé pour ${nomFrigo}`);
    } catch (err) {
        console.error('❌ Erreur email :', err.message);
    }
}

module.exports = { envoyerAlerte };