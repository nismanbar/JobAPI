const express = require("express");
const router = express.Router();

const authenticateJWT = require("../MiddleWare");

const {
    createCompany,
    getCompanyById,
    getCompaniesByOwner,
    getAllCompanies
} = require("../controllers/companyController");

router.post("/", authenticateJWT, createCompany);

router.get("/:companyId", authenticateJWT, getCompanyById);

router.get("/owner/:ownerId", authenticateJWT, getCompaniesByOwner);

router.get("/", authenticateJWT, getAllCompanies);

module.exports = router;