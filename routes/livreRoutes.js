const express = require('express');
const router = express.Router();
const livreController = require('../controllers/livreController');

//  Import des middlewares d'authentification
const { verifyToken, isAdmin } = require('../middleware/auth');

//  Liste des livres (tout le monde peut voir)
router.get('/', livreController.getLivres);

//  Ajouter un livre (admin seulement)
router.post('/', verifyToken, isAdmin, livreController.ajouterLivre);

//  Modifier un livre (admin seulement)
router.put('/:id', verifyToken, isAdmin, livreController.modifierLivre);

//  Supprimer un livre (admin seulement)
router.delete('/:id', verifyToken, isAdmin, livreController.supprimerLivre);

module.exports = router;
