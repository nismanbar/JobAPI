const express = require("express");
const router = express.Router();

const { applyToJob, getApplicationsByUser } = require("../controllers/jobApplicationController");

router.post("/", applyToJob);
router.get("/user/:userId", getApplicationsByUser);

module.exports = router;
