const express = require("express");
const router = express.Router();

const { createJob, searchJobs, deactivateJob } = require("../controllers/jobController");

router.post("/", createJob);
router.get("/search", searchJobs);
router.put("/:jobId/deactivate", deactivateJob);

module.exports = router;
