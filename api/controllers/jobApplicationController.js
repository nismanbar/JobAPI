const JobApplication = require("../models/JobApplication");
const Job = require("../models/Job");
const Company = require("../models/Company");

function isValidStatus(status) {
    return status === "pending" ||
        status === "offered" ||
        status === "accepted" ||
        status === "rejected";
}

function isActiveStatus(status) {
    return status === "pending" ||
        status === "offered" ||
        status === "accepted";
}

async function populateApplication(applicationId) {
    return JobApplication.findById(applicationId).populate({
        path: "jobId",
        populate: { path: "company" }
    });
}

module.exports = {
    applyToJob: async function (req, res) {
        try {
            const jobId = req.body.jobId;
            const userId = req.body.userId;

            if (!jobId || !userId) {
                return res.status(400).json({ message: "jobId and userId are required" });
            }

            if (!req.user || req.user.FireBaseId !== userId) {
                return res.status(403).json({ message: "Not allowed" });
            }

            if (req.user.role !== "JOB_SEEKER") {
                return res.status(403).json({ message: "Not allowed" });
            }

            const job = await Job.findById(jobId);
            if (!job || !job.isActive) {
                return res.status(404).json({ message: "Job not found" });
            }

            const existingApplication = await JobApplication.findOne({
                jobId: jobId,
                userId: userId
            });

            if (existingApplication) {
                if (isActiveStatus(existingApplication.status)) {
                    return res.status(409).json({ message: "Application already exists" });
                }

                existingApplication.status = "pending";
                existingApplication.appliedAt = Date.now();
                await existingApplication.save();

                const populated = await populateApplication(existingApplication._id);

                return res.status(200).json({
                    message: "Application restored",
                    application: populated
                });
            }

            const application = await JobApplication.create({
                jobId: jobId,
                userId: userId,
                status: "pending",
                appliedAt: Date.now()
            });

            const populated = await populateApplication(application._id);

            return res.status(201).json({
                message: "Application submitted successfully",
                application: populated
            });
        } catch (error) {
            console.error("applyToJob error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    },

    offerPosition: async function (req, res) {
        try {
            const jobId = req.body.jobId;
            const userId = req.body.userId;

            if (!jobId || !userId) {
                return res.status(400).json({ message: "jobId and userId are required" });
            }

            if (!req.user || req.user.role !== "EMPLOYER") {
                return res.status(403).json({ message: "Not allowed" });
            }

            const job = await Job.findById(jobId).populate("company");
            if (!job || !job.company) {
                return res.status(404).json({ message: "Job not found" });
            }

            if (job.company.ownerId !== req.user.FireBaseId) {
                return res.status(403).json({ message: "Not allowed" });
            }

            const existingApplication = await JobApplication.findOne({
                jobId: jobId,
                userId: userId
            });

            if (existingApplication) {
                if (isActiveStatus(existingApplication.status)) {
                    return res.status(409).json({ message: "Application already exists" });
                }

                existingApplication.status = "offered";
                existingApplication.appliedAt = Date.now();
                await existingApplication.save();

                const populated = await populateApplication(existingApplication._id);

                return res.status(200).json({
                    message: "Offer restored",
                    application: populated
                });
            }

            const application = await JobApplication.create({
                jobId: jobId,
                userId: userId,
                status: "offered",
                appliedAt: Date.now()
            });

            const populated = await populateApplication(application._id);

            return res.status(201).json({
                message: "Position offered successfully",
                application: populated
            });
        } catch (error) {
            console.error("offerPosition error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    },

    updateApplicationStatus: async function (req, res) {
        try {
            const applicationId = req.params.applicationId;
            const status = req.body.status;

            if (!isValidStatus(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }

            const application = await JobApplication.findById(applicationId).populate({
                path: "jobId",
                populate: { path: "company" }
            });

            if (!application) {
                return res.status(404).json({ message: "Application not found" });
            }

            if (!application.jobId || !application.jobId.company) {
                return res.status(400).json({ message: "Job not found" });
            }

            const currentUserId = req.user ? req.user.FireBaseId : null;
            const currentUserRole = req.user ? req.user.role : null;
            const employerOwnerId = application.jobId.company.ownerId;

            if (application.status === "pending") {
                if (currentUserRole !== "EMPLOYER" || currentUserId !== employerOwnerId) {
                    return res.status(403).json({ message: "Not allowed" });
                }
            } else if (application.status === "offered") {
                if (currentUserRole !== "JOB_SEEKER" || currentUserId !== application.userId) {
                    return res.status(403).json({ message: "Not allowed" });
                }
            } else {
                return res.status(400).json({ message: "Application can no longer be updated" });
            }

            if (status !== "accepted" && status !== "rejected") {
                return res.status(400).json({ message: "Only accepted or rejected are allowed" });
            }

            application.status = status;
            await application.save();

            const populated = await populateApplication(application._id);

            return res.status(200).json({
                message: "Application status updated",
                application: populated
            });
        } catch (error) {
            console.error("updateApplicationStatus error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    },

    getApplicationsByUser: async function (req, res) {
        try {
            const userId = req.params.userId;

            if (!userId) {
                return res.status(400).json({ message: "userId is required" });
            }

            if (!req.user || req.user.FireBaseId !== userId) {
                return res.status(403).json({ message: "Not allowed" });
            }

            const applications = await JobApplication.find({ userId: userId })
                .populate({
                    path: "jobId",
                    populate: { path: "company" }
                })
                .sort({ appliedAt: -1 });

            return res.status(200).json(applications);
        } catch (error) {
            console.error("getApplicationsByUser error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    },

    getApplicationsByCompany: async function (req, res) {
        try {
            const companyId = req.params.companyId;

            if (!companyId) {
                return res.status(400).json({ message: "companyId is required" });
            }

            const company = await Company.findById(companyId);
            if (!company) {
                return res.status(404).json({ message: "Company not found" });
            }

            if (!req.user || req.user.role !== "EMPLOYER" || req.user.FireBaseId !== company.ownerId) {
                return res.status(403).json({ message: "Not allowed" });
            }

            const jobs = await Job.find({ company: companyId }).select("_id");
            const jobIds = jobs.map(function (job) {
                return job._id;
            });

            if (jobIds.length === 0) {
                return res.status(200).json([]);
            }

            const applications = await JobApplication.find({
                jobId: { $in: jobIds }
            })
                .populate({
                    path: "jobId",
                    populate: { path: "company" }
                })
                .sort({ appliedAt: -1 });

            return res.status(200).json(applications);
        } catch (error) {
            console.error("getApplicationsByCompany error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }
};