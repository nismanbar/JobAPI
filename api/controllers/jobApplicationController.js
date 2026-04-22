const JobApplication = require("../models/JobApplication");
const Job = require("../models/Job");

module.exports = {
    applyToJob: async (req, res) => {
        try {
            const { jobId, userId } = req.body;

            if (!jobId || !userId) {
                return res.status(400).json({ message: "jobId and userId are required" });
            }

            const existingApplication = await JobApplication.findOne({ jobId, userId });
            if (existingApplication) {
                return res.status(409).json({ message: "You have already applied to this job" });
            }

            const job = await Job.findById(jobId);
            if (!job || !job.isActive) {
                return res.status(404).json({ message: "Job not found or inactive" });
            }

            const application = await JobApplication.create({
                jobId,
                userId,
                status: "pending"
            });

            const populated = await JobApplication.findById(application._id)
                .populate({ path: "jobId", populate: { path: "company" } });

            return res.status(201).json({
                message: "Application submitted successfully",
                application: populated
            });
        } catch (error) {
            console.error("applyToJob error:", error);
            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    },

    offerPosition: async (req, res) => {
        try {
            const { jobId, userId } = req.body;

            if (!jobId || !userId) {
                return res.status(400).json({ message: "jobId and userId are required" });
            }

            if (!req.user || req.user.role !== "EMPLOYER") {
                return res.status(403).json({ message: "Only employers can offer positions" });
            }

            const job = await Job.findById(jobId).populate("company");
            if (!job || !job.isActive) {
                return res.status(404).json({ message: "Job not found or inactive" });
            }

            if (!job.company || job.company.ownerId !== req.user.FireBaseId) {
                return res.status(403).json({ message: "You do not own this company/job" });
            }

            const existingApplication = await JobApplication.findOne({ jobId, userId });

            let application;
            if (existingApplication) {
                existingApplication.status = "offered";
                existingApplication.appliedAt = existingApplication.appliedAt || Date.now();
                application = await existingApplication.save();
            } else {
                application = await JobApplication.create({
                    jobId,
                    userId,
                    status: "offered"
                });
            }

            const populated = await JobApplication.findById(application._id)
                .populate({ path: "jobId", populate: { path: "company" } });

            return res.status(existingApplication ? 200 : 201).json({
                message: "Offer sent successfully",
                application: populated
            });
        } catch (error) {
            console.error("offerPosition error:", error);
            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    },

    getApplicationsByUser: async (req, res) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({ message: "userId is required" });
            }

            const applications = await JobApplication.find({ userId })
                .populate({ path: "jobId", populate: { path: "company" } })
                .sort({ appliedAt: -1 });

            return res.status(200).json(applications);
        } catch (error) {
            console.error("getApplicationsByUser error:", error);
            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    },

    getApplicationsByCompany: async (req, res) => {
        try {
            const { companyId } = req.params;

            if (!companyId) {
                return res.status(400).json({ message: "companyId is required" });
            }

            const jobs = await Job.find({ company: companyId }).select("_id");
            const jobIds = jobs.map(job => job._id);

            if (jobIds.length === 0) {
                return res.status(200).json([]);
            }

            const applications = await JobApplication.find({ jobId: { $in: jobIds } })
                .populate({ path: "jobId", populate: { path: "company" } })
                .sort({ appliedAt: -1 });

            return res.status(200).json(applications);
        } catch (error) {
            console.error("getApplicationsByCompany error:", error);
            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    }
};