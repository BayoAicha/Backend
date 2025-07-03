// controllers/commentaireController.js
const db = require("../config/db");

// Ajouter un commentaire
exports.ajouterCommentaire = (req, res) => {
  const { livre_id, commentaire, note } = req.body;
  const utilisateur_id = req.user.id;

  if (!utilisateur_id || !livre_id || !commentaire) {
    return res.status(400).json({ message: "Champs manquants." });
  }

  const sql = note
    ? "INSERT INTO commentaires (utilisateur_id, livre_id, note, commentaire) VALUES (?, ?, ?, ?)"
    : "INSERT INTO commentaires (utilisateur_id, livre_id, commentaire) VALUES (?, ?, ?)";
  const params = note
    ? [utilisateur_id, livre_id, note, commentaire]
    : [utilisateur_id, livre_id, commentaire];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Erreur SQL lors de l\'ajout de commentaire :', err);
      return res.status(500).json({ message: "Erreur serveur.", error: err });
    }
    res.status(201).json({ message: "Commentaire ajouté !" });
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
    ORDER BY c.id DESC
  `;

  db.query(sql, [livre_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur serveur.", error: err });
    res.json(result);
  });
};
