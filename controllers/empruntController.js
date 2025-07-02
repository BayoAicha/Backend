const db = require("../config/db");

//  Création d'un emprunt
exports.createEmprunt = (req, res) => {
  const { utilisateur_id, livre_id, date_retour } = req.body;
  const sql = "INSERT INTO emprunts (user_id, livre_id, date_retour) VALUES (?, ?, ?)";

  db.query(sql, [utilisateur_id, livre_id, date_retour], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Votre emprunt a été créé avec succès", id: result.insertId });
  });
};

// Récupération des emprunts de l’utilisateur connecté
exports.getUserEmprunts = (req, res) => {
  const userId = req.user.id;
  const sql = `
    SELECT e.*, l.titre, l.auteur
    FROM emprunts e
    JOIN livres l ON e.livre_id = l.id
    WHERE e.utilisateur_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};
