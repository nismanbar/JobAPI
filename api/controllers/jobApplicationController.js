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

    updateApplicationStatus: async (req, res) => {
        try {
            const { applicationId } = req.params;
            const { status } = req.body;

            if (!["accepted", "rejected", "pending"].includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }

            const application = await JobApplication.findById(applicationId)
                .populate({ path: "jobId", populate: { path: "company" } });

            if (!application) {
                return res.status(404).json({ message: "Application not found" });
            }

            if (!application.jobId || !application.jobId.company) {
                return res.status(400).json({ message: "Job/company not found for application" });
            }

            const ownerId = application.jobId.company.ownerId;
            if (!req.user || req.user.role !== "EMPLOYER" || req.user.FireBaseId !== ownerId) {
                return res.status(403).json({ message: "You are not allowed to change this application" });
            }

            application.status = status;
            await application.save();

            const populated = await JobApplication.findById(application._id)
                .populate({ path: "jobId", populate: { path: "company" } });

            return res.status(200).json({
                message: "Application status updated",
                application: populated
            });
        } catch (error) {
            console.error("updateApplicationStatus error:", error);
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