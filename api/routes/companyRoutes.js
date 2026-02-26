const express = require("express");
const router = express.Router();

const authenticateJWT = require("../MiddleWare");

const {
    createCompany,
    getCompanyById,
    getCompaniesByOwner,
    getAllCompanies
} = require("../controllers/companyController");

// יצירת חברה – רק למשתמשים מורשים
router.post("/", authenticateJWT, createCompany);

// קבלת חברה לפי _id – ציבורי או מורשה לפי החלטה
router.get("/:companyId", authenticateJWT, getCompanyById);

// קבלת כל החברות של owner – רק הבעלים עצמו או אדמין
router.get("/owner/:ownerId", authenticateJWT, getCompaniesByOwner);

// קבלת כל החברות – ציבורי או רק אדמין
router.get("/", authenticateJWT, getAllCompanies);

module.exports = router;