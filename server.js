const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const commentaireRoutes = require("./routes/commentaireRoutes");


//  Charger les variables d'environnement
dotenv.config();

//  Connexion DB
const { testConnection } = require('./config/db');

//  Import des routes
const empruntRoutes = require('./routes/empruntRoutes');
const authRoutes = require('./routes/authRoutes');
const livreRoutes = require('./routes/livreRoutes');
const adminRoutes = require('./routes/adminRoutes'); 

const app = express();

//  Middlewares globaux
app.use(cors());
app.use(express.json());

//  Routes API
app.use('/api/auth', authRoutes);
app.use('/api/livres', livreRoutes);
app.use('/api/emprunts', empruntRoutes);
app.use('/api/admin', adminRoutes); //
app.use("/api/commentaires", commentaireRoutes);

//  Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Serveur backend démarré sur le port ${PORT}`);
});
