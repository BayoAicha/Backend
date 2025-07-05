const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const commentaireRoutes = require("./routes/commentaireRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

//  Chargement des variables d'environnement
dotenv.config();

//  Connexion à la base se bonnées
const { testConnection } = require('./config/db');

//  Importation des routes
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
app.use("/api/notifications", notificationRoutes);

//  Démarrage du serveur sur le port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Serveur backend démarré sur le port ${PORT}`);
});
