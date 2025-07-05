const express = require('express');
const router = express.Router();
const livreController = require('../controllers/livreController');

//  Import des middlewares d'authentification
const { verifyToken, isAdmin } = require('../middleware/auth');

//  Liste des livres que tout le monde peut voir
router.get('/', livreController.getLivres);

//  Ajout d'un livre possible pour admin seulement
router.post('/', verifyToken, isAdmin, livreController.ajouterLivre);

//  Modification d'un livre possible pour admin seulement
router.put('/:id', verifyToken, isAdmin, livreController.modifierLivre);

//  Supprition d'un livre possible pour admin seulement
router.delete('/:id', verifyToken, isAdmin, livreController.supprimerLivre);

module.exports = router;
