const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");
const { getAllUsers, getAllEmprunts } = require("../controllers/adminController");

router.get("/users", verifyToken, isAdmin, getAllUsers);
router.get("/emprunts", verifyToken, isAdmin, getAllEmprunts);

module.exports = router;
