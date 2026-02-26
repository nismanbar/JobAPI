const express = require("express");
const router = express.Router();

const authenticateJWT = require("../MiddleWare");

const {
    applyToJob,
    getApplicationsByUser,
    getApplicationsByCompany
} = require("../controllers/jobApplicationController");

// הגשת מועמדות למשרה – רק למשתמשים מורשים
router.post("/", authenticateJWT, applyToJob);

// קבלת כל ההגשות של משתמש לפי userId – רק למשתמש עצמו או אדמין
router.get("/user/:userId", authenticateJWT, getApplicationsByUser);

// קבלת כל ההגשות למשרות של חברה – רק לבעל החברה או אדמין
router.get("/company/:companyId", authenticateJWT, getApplicationsByCompany);

module.exports = router;