const db = require('../config/db');

// Liste des livres (avec filtres facultatifs)
exports.getLivres = (req, res) => {
  const { titre, auteur, genre } = req.query;

  let sql = "SELECT * FROM livres WHERE 1=1";
  let params = [];

  if (titre) {
    sql += " AND titre LIKE ?";
    params.push(`%${titre}%`);
  }
  if (auteur) {
    sql += " AND auteur LIKE ?";
    params.push(`%${auteur}%`);
  }
  if (genre) {
    sql += " AND genre = ?";
    params.push(genre);
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur serveur", error: err });
    res.json(result);
  });
};

// Ajouter un livre
exports.ajouterLivre = (req, res) => {
  const { titre, auteur, genre } = req.body;

  const sql = "INSERT INTO livres (titre, auteur, genre) VALUES (?, ?, ?)";
  db.query(sql, [titre, auteur, genre], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur serveur", error: err });
    res.status(201).json({ message: "Livre ajouté", id: result.insertId });
  });
};

// Modifier un livre
exports.modifierLivre = (req, res) => {
  const { id } = req.params;
  const { titre, auteur, genre, disponible } = req.body;

  const sql = "UPDATE livres SET titre = ?, auteur = ?, genre = ?, disponible = ? WHERE id = ?";
  db.query(sql, [titre, auteur, genre, disponible, id], (err) => {
    if (err) return res.status(500).json({ message: "Erreur serveur", error: err });
    res.json({ message: "Livre mis à jour" });
  });
};

// Supprimer un livre
exports.supprimerLivre = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM livres WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Erreur serveur", error: err });
    res.json({ message: "Livre supprimé" });
  });
};
