const db = require("../config/db");

//  Création d'un emprunt avec vérification d'emprunt en cours
exports.createEmprunt = (req, res) => {
  const { livre_id, date_retour } = req.body;
  const utilisateur_id = req.user.id;
  console.log('Tentative d\'emprunt :', { utilisateur_id, livre_id, date_retour });

  // Vérification si l'utilisateur a déjà un emprunt non rendu pour ce même livre
  const checkSql = `SELECT * FROM emprunts WHERE utilisateur_id = ? AND livre_id = ? AND date_retour_effective IS NULL`;
  db.query(checkSql, [utilisateur_id, livre_id], (err, rows) => {
    if (err) {
      console.error('Erreur SQL lors de la vérification d\'emprunt en cours :', err);
      return res.status(500).json({ message: "Erreur serveur", error: err });
    }
    if (rows.length > 0) {
      console.warn('Emprunt déjà en cours pour ce livre et cet utilisateur.');
      return res.status(400).json({ message: "Vous devez d'abord rendre ce livre avant de pouvoir l'emprunter à nouveau." });
    }
    // Si pas d'emprunt en cours, on autorise l'emprunt
    const sql = "INSERT INTO emprunts (utilisateur_id, livre_id, date_retour) VALUES (?, ?, ?)";
    console.log('Requête SQL :', sql);
    console.log('Paramètres :', [utilisateur_id, livre_id, date_retour]);
    db.query(sql, [utilisateur_id, livre_id, date_retour], (err, result) => {
      if (err) {
        console.error('Erreur SQL lors de l\'insertion d\'emprunt :', err);
        if (err.sqlMessage) {
          console.error('Message SQL:', err.sqlMessage);
        }
        if (err.sql) {
          console.error('Requête SQL:', err.sql);
        }
        return res.status(500).json({ message: 'Erreur serveur', error: err });
      }
      console.log('Emprunt inséré avec succès, id :', result.insertId);
      res.json({ message: "Livre emprumté avec succès ", id: result.insertId });
    });
  });
};


// Récupération des emprunts de l’utilisateur connecté
exports.getUserEmprunts = (req, res) => {
  const userId = req.user.id;
  const sql = `
    SELECT e.*, l.titre, l.auteur, l.genre
    FROM emprunts e
    JOIN livres l ON e.livre_id = l.id
    WHERE e.utilisateur_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};
