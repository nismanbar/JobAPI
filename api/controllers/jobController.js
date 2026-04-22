const Job = require("../models/Job");

function extractCompanyId(company) {
    if (!company) return null;
    if (typeof company === "string") return company;
    return company._id || company.id || null;
}

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

            const companyId = extractCompanyId(company);

            if (!title || !description || !location || !category || !companyId) {
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
                company: companyId,
                isActive: true
            });

            const populatedJob = await Job.findById(job._id).populate("company");

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

    // קבלת כל המשרות של חברה מסוימת
    getJobsByCompany: async (req, res) => {
        try {
            const { companyId } = req.params;

            if (!companyId) {
                return res.status(400).json({
                    message: "companyId is required"
                });
            }

            const jobs = await Job.find({ company: companyId })
                .populate("company")
                .sort({ createdAt: -1 });

            return res.status(200).json(jobs);
        } catch (error) {
            console.error("getJobsByCompany error:", error);
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

    // עדכון משרה
    updateJob: async (req, res) => {
        try {
            const { jobId } = req.params;
            const {
                title,
                description,
                location,
                category,
                salaryFrom,
                salaryTo,
                salary,
                company,
                isActive
            } = req.body;

            const job = await Job.findById(jobId);

            if (!job) {
                return res.status(404).json({
                    message: "Job not found"
                });
            }

            if (title !== undefined) job.title = title;
            if (description !== undefined) job.description = description;
            if (location !== undefined) job.location = location;
            if (category !== undefined) job.category = category;
            if (salaryFrom !== undefined) job.salaryFrom = salaryFrom;
            if (salaryTo !== undefined) job.salaryTo = salaryTo;
            if (salary !== undefined) job.salary = salary;
            if (isActive !== undefined) job.isActive = isActive;

            const companyId = extractCompanyId(company);
            if (companyId) {
                job.company = companyId;
            }

            await job.save();

            const populatedJob = await Job.findById(job._id).populate("company");

            return res.status(200).json({
                message: "Job updated successfully",
                job: populatedJob
            });
        } catch (error) {
            console.error("updateJob error:", error);
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
    },

    getJobById: async (req, res) => {
        try {
            const job = await Job.findById(req.params.jobId).populate("company");

            if (!job) {
                return res.status(404).json({ message: "Job not found" });
            }

            res.json(job);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};