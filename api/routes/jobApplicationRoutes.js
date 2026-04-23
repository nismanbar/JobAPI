const express = require("express");
const router = express.Router();

const authenticateJWT = require("../MiddleWare");
const {
    applyToJob,
    updateApplicationStatus,
    getApplicationsByUser,
    getApplicationsByCompany
} = require("../controllers/jobApplicationController");

router.post("/", authenticateJWT, applyToJob);
router.put("/:applicationId/status", authenticateJWT, updateApplicationStatus);
router.get("/user/:userId", authenticateJWT, getApplicationsByUser);
router.get("/company/:companyId", authenticateJWT, getApplicationsByCompany);

module.exports = router;