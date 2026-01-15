const express = require("express");
const router = express.Router();

const { createCompany, getCompanyById, getCompaniesByOwner, getAllCompanies } = require("../controllers/companyController");
router.post("/", createCompany);
router.get("/:companyId", getCompanyById);
router.get("/owner/:ownerId", getCompaniesByOwner);
router.get("/", getAllCompanies);

module.exports = router;
