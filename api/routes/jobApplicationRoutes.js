const express = require("express");
const router = express.Router();

const authenticateJWT = require("../MiddleWare");

const {
    applyToJob,
    getApplicationsByUser
} = require("../controllers/jobApplicationController");

router.post("/", authenticateJWT, applyToJob);

router.get("/user/:userId", authenticateJWT, getApplicationsByUser);

module.exports = router;