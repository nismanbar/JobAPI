const express = require("express");
const router = express.Router();

const authenticateJWT = require("../MiddleWare");

const {
    createJob,
    searchJobs,
    deactivateJob,
    getJobById
} = require("../controllers/jobController");

// יצירת משרה – רק למשתמשים מורשים
router.post("/", authenticateJWT, createJob);

// חיפוש משרות – ציבורי (אפשר גם להגן אם רוצים)
router.get("/search", searchJobs);

// קבלת משרה לפי _id – ציבורי
router.get("/:jobId", getJobById);

// ביטול משרה – רק למורשים (חברה או אדמין)
router.put("/:jobId/deactivate", authenticateJWT, deactivateJob);

module.exports = router;