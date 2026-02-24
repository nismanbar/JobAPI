const express = require("express");
const router = express.Router();

const authenticateJWT = require("../MiddleWare");

const {
    createJob,
    searchJobs,
    deactivateJob
} = require("../controllers/jobController");

router.post("/", authenticateJWT, createJob);

router.get("/search", authenticateJWT, searchJobs);

router.put("/:jobId/deactivate", authenticateJWT, deactivateJob);

module.exports = router;