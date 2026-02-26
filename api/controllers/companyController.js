const Company = require("../models/Company");

module.exports = {

    // יצירת חברה חדשה
    createCompany: async (req, res) => {
        try {
            const { name, description, logoUrl, ownerId } = req.body;

            if (!name || !ownerId) {
                return res.status(400).json({
                    message: "name and ownerId are required"
                });
            }

            const company = await Company.create({
                name,
                description: description || "",
                logoUrl: logoUrl || "",
                ownerId
            });

            return res.status(201).json({
                message: "Company created successfully",
                company
            });

        } catch (error) {
            console.error("createCompany error:", error);
            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    },


    // קבלת חברה לפי _id
    getCompanyById: async (req, res) => {
        try {
            const { companyId } = req.params;

            const company = await Company.findById(companyId);

            if (!company) {
                return res.status(404).json({
                    message: "Company not found"
                });
            }

            return res.status(200).json(company);

        } catch (error) {
            console.error("getCompanyById error:", error);
            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    },


    // קבלת כל החברות של owner מסוים (לפי FireBaseId)
    getCompaniesByOwner: async (req, res) => {
        try {
            const { ownerId } = req.params;

            if (!ownerId) {
                return res.status(400).json({ message: "ownerId is required" });
            }

            const companies = await Company.find({ ownerId })
                .sort({ createdAt: -1 });

            return res.status(200).json(companies);

        } catch (error) {
            console.error("getCompaniesByOwner error:", error);
            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    },


    // קבלת כל החברות
    getAllCompanies: async (req, res) => {
        try {
            const companies = await Company.find()
                .sort({ createdAt: -1 });

            return res.status(200).json(companies);

        } catch (error) {
            console.error("getAllCompanies error:", error);
            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    }

};