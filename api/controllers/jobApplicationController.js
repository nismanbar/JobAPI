const JobApplication = require("../models/JobApplication");
const Job = require("../models/Job");

module.exports = {

    // הגשת מועמדות למשרה
    applyToJob: async (req, res) => {
        try {

            const { jobId, userId } = req.body;

            if (!jobId || !userId) {
                return res.status(400).json({
                    message: "jobId and userId are required"
                });
            }

            // בדיקה אם המשתמש כבר הגיש למשרה הזו
            const existingApplication = await JobApplication.findOne({ jobId, userId });

            if (existingApplication) {
                return res.status(409).json({
                    message: "You have already applied to this job"
                });
            }

            const job = await Job.findById(jobId);

            if (!job || !job.isActive) {
                return res.status(404).json({
                    message: "Job not found or inactive"
                });
            }

            const application = await JobApplication.create({
                jobId,
                userId,
                status: "pending"
            });

            return res.status(201).json({
                message: "Application submitted successfully",
                application
            });

        } catch (error) {
            console.error("applyToJob error:", error);
            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    },


    // קבלת כל ההגשות של משתמש לפי FireBaseId
    getApplicationsByUser: async (req, res) => {
        try {

            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({ message: "userId is required" });
            }

            const applications = await JobApplication.find({ userId })
                .populate({
                    path: "jobId",
                    populate: { path: "company" }
                })
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


    // קבלת כל ההגשות למשרות של חברה מסוימת
    getApplicationsByCompany: async (req, res) => {
        try {

            const { companyId } = req.params;

            if (!companyId) {
                return res.status(400).json({ message: "companyId is required" });
            }

            // מוציא את כל המשרות של החברה
            const jobs = await Job.find({ company: companyId }).select("_id");

            const jobIds = jobs.map(job => job._id);

            if (jobIds.length === 0) {
                return res.status(200).json([]);
            }

            const applications = await JobApplication.find({ jobId: { $in: jobIds } })
                .populate({
                    path: "jobId",
                    populate: { path: "company" }
                })
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