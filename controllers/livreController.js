const db = require('../config/db');

// Liste des livres (filtrage combiné)
exports.getLivres = (req, res) => {
  const { titre, auteur, genre } = req.query;

  let sql = "SELECT * FROM livres WHERE 1=1";
  const params = [];

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
    if (err) {
      console.error("Erreur SQL :", err);
      return res.status(500).json({ message: "Erreur serveur", error: err });
    }
    res.json(result);
  });
};

//  Fournir genres et auteurs uniques pour remplir les listes déroulantes, dépendant des filtres
exports.getFiltres = (req, res) => {
  const { titre, auteur, genre } = req.query;

  // préparer les requêtes pour genres et auteurs avec les mêmes filtres
  let sqlGenres = "SELECT DISTINCT genre FROM livres WHERE 1=1";
  let sqlAuteurs = "SELECT DISTINCT auteur FROM livres WHERE 1=1";
  const paramsGenres = [];
  const paramsAuteurs = [];

  if (titre) {
    sqlGenres += " AND titre LIKE ?";
    paramsGenres.push(`%${titre}%`);
    sqlAuteurs += " AND titre LIKE ?";
    paramsAuteurs.push(`%${titre}%`);
  }
  if (auteur) {
    sqlGenres += " AND auteur LIKE ?";
    paramsGenres.push(`%${auteur}%`);
  }
  if (genre) {
    sqlAuteurs += " AND genre = ?";
    paramsAuteurs.push(genre);
  }

  db.query(sqlGenres, paramsGenres, (err, genres) => {
    if (err) {
      console.error("Erreur SQL genres :", err);
      return res.status(500).json({ message: "Erreur serveur", error: err });
    }

    db.query(sqlAuteurs, paramsAuteurs, (err, auteurs) => {
      if (err) {
        console.error("Erreur SQL auteurs :", err);
        return res.status(500).json({ message: "Erreur serveur", error: err });
      }

      res.json({
        genres: genres.map(g => g.genre),
        auteurs: auteurs.map(a => a.auteur)
      });
    });
  });
};

// Ajouter un livre
exports.ajouterLivre = (req, res) => {
  const { titre, auteur, genre } = req.body;

  if (!titre || !auteur || !genre) {
    return res.status(400).json({ message: "Champs requis manquants." });
  }

  const sql = "INSERT INTO livres (titre, auteur, genre) VALUES (?, ?, ?)";
  db.query(sql, [titre, auteur, genre], (err, result) => {
    if (err) {
      console.error("Erreur SQL insertion :", err);
      return res.status(500).json({ message: "Erreur serveur", error: err });
    }
    res.status(201).json({ message: "Livre ajouté avec succès", id: result.insertId });
  });
};

// Mettre à jour un livre
exports.modifierLivre = (req, res) => {
  const { id } = req.params;
  const { titre, auteur, genre, disponible } = req.body;

  const sql = "UPDATE livres SET titre = ?, auteur = ?, genre = ?, disponible = ? WHERE id = ?";
  db.query(sql, [titre, auteur, genre, disponible, id], (err, result) => {
    if (err) {
      console.error("Erreur SQL update :", err);
      return res.status(500).json({ message: "Erreur serveur", error: err });
    }
    res.json({ message: "Livre mis à jour avec succès" });
  });
};

// Supprimer un livre
exports.supprimerLivre = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM livres WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erreur SQL delete :", err);
      return res.status(500).json({ message: "Erreur serveur", error: err });
    }
    res.json({ message: "Livre supprimé avec succès" });
  });
};