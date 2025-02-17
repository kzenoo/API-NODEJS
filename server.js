require('dotenv').config();
const express = require('express');
const connectDB = require('./config/mongodb');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.use(routes);

app.get('/', (req, res) => {
    res.send('🚀 Serveur Express fonctionne avec MongoDB');
});

app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
