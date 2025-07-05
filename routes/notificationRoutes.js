const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { getNotifications } = require("../controllers/authController");

// Récupérer les notifications de l'utilisateur connecté
router.get("/notifications", verifyToken, getNotifications);

module.exports = router;
