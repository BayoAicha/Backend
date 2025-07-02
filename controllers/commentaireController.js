// controllers/commentaireController.js
const db = require("../config/db");

// Ajouter un commentaire
exports.ajouterCommentaire = (req, res) => {
  const { utilisateur_id, livre_id, note, comment } = req.body;

  if (!user_id || !livre_id || !note || !comment) {
    return res.status(400).json({ message: "Champs manquants." });
  }

  const sql = "INSERT INTO commentaires (utilisateur_id, livre_id, note, comment) VALUES (?, ?, ?, ?)";
  db.query(sql, [utilisateur_id, livre_id, note, comment], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur serveur.", error: err });
    res.status(201).json({ message: " Commentaire ajouté !" });
  });
};

// Récupérer les commentaires d'un livre
exports.getCommentaires = (req, res) => {
  const { livre_id } = req.params;

  const sql = `
    SELECT c.*, u.nom AS utilisateur
    FROM commentaires c
    JOIN utilisateurs u ON c.utilisateur_id = u.id
    WHERE c.livre_id = ?
    ORDER BY c.crée_le DESC
  `;

  db.query(sql, [livre_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur serveur.", error: err });
    res.json(result);
  });
};
