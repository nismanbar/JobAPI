const Job = require("../models/Job");

module.exports = {

    // יצירת משרה
    createJob: async (req, res) => {
        try {

            const {
                title,
                description,
                location,
                category,
                salaryFrom,
                salaryTo,
                salary,
                company
            } = req.body;

            if (!title || !description || !location || !category || !company) {
                return res.status(400).json({
                    message: "Missing required fields"
                });
            }

            const job = await Job.create({
                title,
                description,
                location,
                category,
                salaryFrom: salaryFrom || 0,
                salaryTo: salaryTo || 0,
                salary: salary || 0,
                company,
                isActive: true
            });

            const populatedJob = await Job.findById(job._id)
                .populate("company");

            return res.status(201).json({
                message: "Job created successfully",
                job: populatedJob
            });

        } catch (error) {

            console.error("createJob error:", error);

            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    },


    // חיפוש משרות
    searchJobs: async (req, res) => {
        try {

            const {
                keyword,
                location,
                category,
                companyId
            } = req.query;

            let filter = {
                isActive: true
            };

            if (keyword) {
                filter.$or = [
                    { title: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } }
                ];
            }

            if (location) {
                filter.location = {
                    $regex: location,
                    $options: "i"
                };
            }

            if (category) {
                filter.category = category;
            }

            if (companyId) {
                filter.company = companyId;
            }

            const jobs = await Job.find(filter)
                .populate("company")
                .sort({ createdAt: -1 });

            return res.status(200).json(jobs);

        } catch (error) {

            console.error("searchJobs error:", error);

            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    },


    // ביטול משרה (soft delete)
    deactivateJob: async (req, res) => {
        try {

            const { jobId } = req.params;

            const job = await Job.findById(jobId);

            if (!job) {
                return res.status(404).json({
                    message: "Job not found"
                });
            }

            job.isActive = false;

            await job.save();

            return res.status(200).json({
                message: "Job deactivated successfully"
            });

        } catch (error) {

            console.error("deactivateJob error:", error);

            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    }

};