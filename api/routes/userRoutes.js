const express = require("express");
const router = express.Router();

const authenticateJWT = require("../MiddleWare");
const {
    register,
    login,
    getUserByFireBaseId,
    updateUserByFireBaseId,
    getUserById,
    getAllUsers
} = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/firebase/:FireBaseId", authenticateJWT, getUserByFireBaseId);
router.put("/firebase/:FireBaseId", authenticateJWT, updateUserByFireBaseId);
router.get("/:id", authenticateJWT, getUserById);
router.get("/", authenticateJWT, getAllUsers);

module.exports = router;