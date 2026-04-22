const express = require("express");
const router = express.Router();

const authenticateJWT = require("../MiddleWare");
const {
    createJob,
    searchJobs,
    getJobsByCompany,
    updateJob,
    deactivateJob,
    getJobById
} = require("../controllers/jobController");

// יצירת משרה
router.post("/", authenticateJWT, createJob);

// חיפוש משרות
router.get("/search", searchJobs);

// קבלת כל המשרות של חברה
router.get("/company/:companyId", authenticateJWT, getJobsByCompany);

// קבלת משרה לפי _id
router.get("/:jobId", getJobById);

// עדכון משרה
router.put("/:jobId", authenticateJWT, updateJob);

// ביטול משרה
router.put("/:jobId/deactivate", authenticateJWT, deactivateJob);

module.exports = router;