const JobApplication = require("../models/JobApplication");

module.exports = {

    applyToJob: async (req, res) => {
        try {
            const { jobId, userId } = req.body;

            const exists = await JobApplication.findOne({ jobId, userId });
            if (exists) {
                return res.status(400).json({ message: "Already applied" });
            }

            const application = new JobApplication({ jobId, userId });
            await application.save();

            res.status(201).json(application);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getApplicationsByUser: async (req, res) => {
        try {
            const { userId } = req.params;

            const applications = await JobApplication
                .find({ userId })
                .populate("jobId");

            res.json(applications);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};
