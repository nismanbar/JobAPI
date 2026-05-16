const express = require("express");
const router = express.Router();
const authenticateJWT = require("../MiddleWare");

const {
    applyToJob,
    offerPosition,
    cancelApplication,
    updateApplicationStatus,
    getApplicationsByUser,
    getApplicationsByCompany
} = require("../controllers/jobApplicationController");

router.post("/", authenticateJWT, applyToJob);
router.post("/offer", authenticateJWT, offerPosition);
router.post("/cancel", authenticateJWT, cancelApplication);
router.put("/:applicationId", authenticateJWT, updateApplicationStatus);
router.get("/user/:userId", authenticateJWT, getApplicationsByUser);
router.get("/company/:companyId", authenticateJWT, getApplicationsByCompany);

module.exports = router;