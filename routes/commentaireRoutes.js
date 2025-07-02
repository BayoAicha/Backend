// routes/commentaireRoutes.js
const express = require("express");
const router = express.Router();
const commentaireController = require("../controllers/commentaireController");
const { verifyToken } = require("../middleware/auth");

// Un utilisateur connecté peut commenter
router.post("/", verifyToken, commentaireController.ajouterCommentaire);

// Tout le monde peut voir les commentaires d’un livre
router.get("/:livre_id", commentaireController.getCommentaires);

module.exports = router;
