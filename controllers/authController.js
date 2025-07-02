const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

//  INSCRIPTION
exports.register = async (req, res) => {
  const { nom, email, mot_de_passe } = req.body;

  if (!nom || !email || !mot_de_passe) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  // Vérifie si l'utilisateur existe déjà
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

      res.status(201).json({ message: "Utilisateur créé ✅" });
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

    // Vérifie que le mot de passe existe dans la BDD
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