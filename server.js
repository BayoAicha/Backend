const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const empruntRoutes = require('./routes/empruntRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require("./routes/adminRoutes");

// Configuration de la base de données
const { testConnection } = require('./config/db');

dotenv.config();

const livreRoutes = require('./routes/livreRoutes');
// const authRoutes = require('./routes/authRoutes'); // tu peux l'activer quand tu feras l'auth

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/emprunts', empruntRoutes);
app.use('/api/auth', authRoutes)


// Routes
// app.use('/api/auth', authRoutes); // à activer plus tard si besoin
app.use('/api/livres', livreRoutes);
app.use("/api/admin", adminRoutes);

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});
