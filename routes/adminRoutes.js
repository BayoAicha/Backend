const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");
const { getAllUsers, getAllEmprunts } = require("../controllers/adminController");
const { ajouterLivre } = require("../controllers/livreController"); // Ajout

router.get("/users", verifyToken, isAdmin, getAllUsers);
router.get("/emprunts", verifyToken, isAdmin, getAllEmprunts);
router.post("/livres", verifyToken, isAdmin, ajouterLivre); // Ajout

module.exports = router;
