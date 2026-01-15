const Company = require("../models/Company");

module.exports = {

    createCompany: async (req, res) => {
        try {
            const { name, description, logoUrl, ownerId } = req.body;

            const company = new Company({
                name,
                description,
                logoUrl,
                ownerId
            });

            await company.save();
            res.status(201).json(company);

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getCompanyById: async (req, res) => {
        try {
            const { companyId } = req.params;

            const company = await Company.findById(companyId)
                .populate("ownerId", "fullName email");

            if (!company) {
                return res.status(404).json({ message: "Company not found" });
            }

            res.json(company);

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getCompaniesByOwner: async (req, res) => {
        try {
            const { ownerId } = req.params;

            const companies = await Company.find({ ownerId });
            res.json(companies);

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getAllCompanies: async (req, res) => {
        try {
            const companies = await Company.find();
            res.json(companies);

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};
