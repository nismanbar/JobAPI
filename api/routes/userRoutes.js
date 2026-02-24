const express = require("express");
const router = express.Router();

const authenticateJWT = require("../MiddleWare");

const {
    register,
    login,
    getUserById,
    getAllUsers
} = require("../controllers/userController");

router.post("/register", register);

router.post("/login", login);

router.get("/:userId", authenticateJWT, getUserById);

router.get("/", authenticateJWT, getAllUsers);

module.exports = router;