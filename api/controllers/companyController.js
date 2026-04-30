const Company = require("../models/Company");

module.exports = {
  createCompany: async function (req, res) {
    try {
      const name = req.body.name;
      const description = req.body.description;
      const logoUrl = req.body.logoUrl;
      const ownerId = req.body.ownerId;

      if (!name || !ownerId) {
        return res.status(400).json({ message: "name and ownerId are required" });
      }

      if (req.user && req.user.FireBaseId !== ownerId) {
        return res.status(403).json({ message: "You are not allowed to create this company" });
      }

      const company = await Company.create({
        name: name,
        description: description || "",
        logoUrl: logoUrl || "",
        ownerId: ownerId
      });

      return res.status(201).json({
        message: "Company created successfully",
        company: company
      });
    } catch (error) {
      console.error("createCompany error:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  },

  updateCompany: async function (req, res) {
    try {
      const companyId = req.params.companyId;
      const name = req.body.name;
      const description = req.body.description;
      const logoUrl = req.body.logoUrl;

      const company = await Company.findById(companyId);

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      if (req.user && req.user.FireBaseId !== company.ownerId) {
        return res.status(403).json({ message: "You are not allowed to update this company" });
      }

      if (name !== undefined) {
        company.name = name;
      }
      if (description !== undefined) {
        company.description = description;
      }
      if (logoUrl !== undefined) {
        company.logoUrl = logoUrl;
      }

      await company.save();

      return res.status(200).json({
        message: "Company updated successfully",
        company: company
      });
    } catch (error) {
      console.error("updateCompany error:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  },

  getCompanyById: async function (req, res) {
    try {
      const companyId = req.params.companyId;
      const company = await Company.findById(companyId);

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
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

  getCompaniesByOwner: async function (req, res) {
    try {
      const ownerId = req.params.ownerId;

      if (!ownerId) {
        return res.status(400).json({ message: "ownerId is required" });
      }

      const companies = await Company.find({ ownerId: ownerId }).sort({ createdAt: -1 });
      return res.status(200).json(companies);
    } catch (error) {
      console.error("getCompaniesByOwner error:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  },

  getAllCompanies: async function (req, res) {
    try {
      const companies = await Company.find().sort({ createdAt: -1 });
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