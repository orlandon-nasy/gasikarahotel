require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const sequelize = require('./config/database');

// Charge les associations entre modèles
require('./models/associations');

// Import des routes
const authRoutes        = require('./routes/auth');
const hotelRoutes       = require('./routes/hotels');
const chambreRoutes     = require('./routes/chambres');
const reservationRoutes = require('./routes/reservations');
const clientRoutes      = require('./routes/clients');
const statsRoutes       = require('./routes/stats');

const app  = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', '*'],
  methods: ['GET','POST','PUT','DELETE','PATCH'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sert les fichiers statiques
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));
app.use('/admin',    express.static(path.join(__dirname, '../admin')));
app.use('/img',      express.static(path.join(__dirname, '../img')));

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '🌿 GasikaraHotel API en ligne' });
});

// Routes
app.use('/api/auth',         authRoutes);
app.use('/api/hotels',       hotelRoutes);
app.use('/api/chambres',     chambreRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/clients',      clientRoutes);
app.use('/api/stats',        statsRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route introuvable : ${req.method} ${req.url}` });
});

// Démarrage
async function demarrer() {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connecté');
    await sequelize.sync({ alter: false });
    console.log('✅ Tables synchronisées');
    app.listen(PORT, () => {
      console.log(`\n🚀 Serveur : http://localhost:${PORT}`);
      console.log(`📋 Santé   : http://localhost:${PORT}/api/health\n`);
    });
  } catch (err) {
    console.error('❌ Erreur démarrage :', err.message);
    console.error('→ Vérifie MySQL et le fichier .env');
    process.exit(1);
  }
}

demarrer();