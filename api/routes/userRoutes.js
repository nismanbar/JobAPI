const express = require("express");
const router = express.Router();

const { register, login, getUserById, getAllUsers } = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/:userId", getUserById);
router.get("/", getAllUsers);

module.exports = router;
