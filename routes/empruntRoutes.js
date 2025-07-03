const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { createEmprunt, getUserEmprunts } = require("../controllers/empruntController");

router.post("/", verifyToken, createEmprunt);
router.get("/", verifyToken, getUserEmprunts);

module.exports = router;
