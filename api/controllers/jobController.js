const Job = require("../models/Job");

module.exports = {

    createJob: async (req, res) => {
        try {
            ////title description location salaryFrom salaryTo category companyId isActive
            const {title,description,location,salaryFrom,salaryTo,category,companyId,isActive} = req.body;
            const job = new Job({ title,description,location,salaryFrom,salaryTo,category,companyId,isActive });
            await job.save();
            res.status(201).json(job);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    searchJobs: async (req, res) => {
        try {
            const { keyword, location, category, minSalary } = req.query;

            const filter = { isActive: true };

            if (keyword) {
                filter.title = { $regex: keyword, $options: "i" };
            }

            if (location) {
                filter.location = location;
            }

            if (category) {
                filter.category = category;
            }

            if (minSalary) {
                filter.salaryTo = { $gte: Number(minSalary) };
            }

            const jobs = await Job
                .find(filter)
                .sort({ createdAt: -1 });

            res.json(jobs);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    deactivateJob: async (req, res) => {
        try {
            const { jobId } = req.params;

            const job = await Job.findByIdAndUpdate(
                jobId,
                { isActive: false },
                { new: true }
            );

            res.json(job);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};
