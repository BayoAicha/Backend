const db = require("../config/db");

//  Tous les utilisateurs
exports.getAllUsers = (req, res) => {
  const sql = "SELECT id, nom, email, role, crée_le FROM utilisateurs";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

//  Tous les emprunts avec jointure livres + users
exports.getAllEmprunts = (req, res) => {
  const sql = `
    SELECT e.id, u.nom AS utilisateurr, u.email, l.titre, l.auteur, e.date_emprunt, e.date_retour, e.retour
    FROM emprunts e
    JOIN users u ON e.user_id = u.id
    JOIN livres l ON e.livre_id = l.id
    ORDER BY e.date_emprunt DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};
