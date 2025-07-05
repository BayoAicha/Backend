const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

//  INSCRIPTION
exports.register = async (req, res) => {
  const { nom, email, mot_de_passe } = req.body;

  if (!nom || !email || !mot_de_passe) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  // Vérification si l'utilisateur existe déjà
  const sqlCheck = "SELECT * FROM utilisateurs WHERE email = ?";
  db.query(sqlCheck, [email], async (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      return res.status(400).json({ message: "Cet email existe déjà." });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const sqlInsert = "INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES (?, ?, ?)";
    db.query(sqlInsert, [nom, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({ message: "Utilisateur créé " });
    });
  });
};

// CONNEXION
exports.login = (req, res) => {
  const { email, mot_de_passe } = req.body;

  const sql = "SELECT * FROM utilisateurs WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    const user = results[0];

    // Vérification du mot de passe dans la BDD
    if (!user.mot_de_passe) {
      return res.status(500).json({ message: "Erreur interne : mot de passe manquant." });
    }

    const match = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

    if (!match) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
};

// Récupéreration des notifications d'un utilisateur
exports.getNotifications = (req, res) => {
  const utilisateur_id = req.user.id;
  const sql = "SELECT * FROM notifications WHERE utilisateur_id = ? ORDER BY date_envoi DESC";
  db.query(sql, [utilisateur_id], (err, rows) => {
    if (err) return res.status(500).json({ message: "Erreur serveur", error: err });
    res.json(rows);
  });
};