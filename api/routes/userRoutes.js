const express = require("express");
const router = express.Router();

const authenticateJWT = require("../MiddleWare");

const {
    register,
    login,
    getUserByFireBaseId,
    getUserById,
    getAllUsers
} = require("../controllers/userController");

// 🔹 הרשמה
router.post("/register", register);

// 🔹 התחברות
router.post("/login", login);

// 🔹 קבלת משתמש לפי FireBaseId
router.get("/firebase/:FireBaseId", authenticateJWT, getUserByFireBaseId);

// 🔹 קבלת משתמש לפי Mongo _id
router.get("/:id", authenticateJWT, getUserById);

// 🔹 קבלת כל המשתמשים
router.get("/", authenticateJWT, getAllUsers);

module.exports = router;