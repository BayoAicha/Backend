const express = require('express');
const router = express.Router();
const livreController = require('../controllers/livreController');

// ✅ Import des middlewares auth
const { verifyToken, isAdmin } = require('../middleware/auth');

// 📚 Routes pour les livres

// Tout le monde peut voir la liste
router.get('/', livreController.getLivres);

// Seul admin connecté peut ajouter
router.post('/', verifyToken, isAdmin, livreController.ajouterLivre);

// Seul admin connecté peut modifier
router.put('/:id', verifyToken, isAdmin, livreController.modifierLivre);

// Seul admin connecté peut supprimer
router.delete('/:id', verifyToken, isAdmin, livreController.supprimerLivre);

module.exports = router;
