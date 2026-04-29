const express = require("express");
const router = express.Router();

const authenticateJWT = require("../MiddleWare");

const {
  createJob,
  searchJobs,
  getJobsByCompany,
  updateJob,
  deactivateJob,
  deleteJob,
  getJobById
} = require("../controllers/jobController");

router.post("/", authenticateJWT, createJob);
router.get("/search", searchJobs);
router.get("/company/:companyId", authenticateJWT, getJobsByCompany);
router.get("/:jobId", getJobById);
router.put("/:jobId", authenticateJWT, updateJob);
router.put("/:jobId/deactivate", authenticateJWT, deactivateJob);
router.delete("/:jobId", authenticateJWT, deleteJob);

module.exports = router;