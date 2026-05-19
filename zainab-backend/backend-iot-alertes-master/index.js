const express = require('express');
const cors    = require('cors');

require('dotenv').config();
require('./db');
require('./services/detection');

const alertesRouter    = require('./routes/alerts');
const historiqueRouter = require('./routes/historique');

const app  = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/alerts',  alertesRouter);
app.use('/api/fridges', historiqueRouter);

// Route de test
app.get('/', (req, res) => {
    res.json({ message: '✅ API Zainab opérationnelle' });
});

app.listen(PORT, () => {
    console.log('🚀 Serveur démarré sur http://localhost:3001');
});