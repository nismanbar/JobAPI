const Job = require("../models/Job");
const Company = require("../models/Company");
const JobApplication = require("../models/JobApplication");
const ChatMessage = require("../models/ChatMessage");

function extractCompanyId(company) {
  if (!company) {
    return null;
  }

  if (typeof company === "string") {
    return company;
  }

  if (company._id) {
    return company._id;
  }

  if (company.id) {
    return company.id;
  }

  return null;
}

async function getOwnedCompany(companyId, ownerId) {
  const company = await Company.findById(companyId);
  if (!company) {
    return null;
  }

  if (company.ownerId !== ownerId) {
    return null;
  }

  return company;
}

module.exports = {
  createJob: async function (req, res) {
    try {
      const title = req.body.title;
      const description = req.body.description;
      const location = req.body.location;
      const category = req.body.category;
      const salaryFrom = req.body.salaryFrom;
      const salaryTo = req.body.salaryTo;
      const salary = req.body.salary;

      const companyId = extractCompanyId(req.body.companyId || req.body.company);

      if (!title || !description || !location || !category || !companyId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (!req.user || req.user.role !== "EMPLOYER") {
        return res.status(403).json({ message: "Only employers can create jobs" });
      }

      const ownedCompany = await getOwnedCompany(companyId, req.user.FireBaseId);
      if (!ownedCompany) {
        return res.status(403).json({ message: "You are not allowed to create jobs for this company" });
      }

      const job = await Job.create({
        title: title,
        description: description,
        location: location,
        category: category,
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

  getJobsByCompany: async function (req, res) {
    try {
      const companyId = req.params.companyId;

      if (!companyId) {
        return res.status(400).json({ message: "companyId is required" });
      }

      const jobs = await Job.find({ company: companyId }).populate("company").sort({ createdAt: -1 });
      return res.status(200).json(jobs);
    } catch (error) {
      console.error("getJobsByCompany error:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  },

  searchJobs: async function (req, res) {
    try {
      const keyword = req.query.keyword;
      const location = req.query.location;
      const category = req.query.category;
      const companyId = req.query.companyId;

      const filter = {
        isActive: true
      };

      if (keyword) {
        filter.$or = [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } }
        ];
      }

      if (location) {
        filter.location = { $regex: location, $options: "i" };
      }

      if (category) {
        filter.category = category;
      }

      if (companyId) {
        filter.company = companyId;
      }

      const jobs = await Job.find(filter).populate("company").sort({ createdAt: -1 });
      return res.status(200).json(jobs);
    } catch (error) {
      console.error("searchJobs error:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  },

  updateJob: async function (req, res) {
    try {
      const jobId = req.params.jobId;
      const title = req.body.title;
      const description = req.body.description;
      const location = req.body.location;
      const category = req.body.category;
      const salaryFrom = req.body.salaryFrom;
      const salaryTo = req.body.salaryTo;
      const salary = req.body.salary;
      const companyIdFromBody = extractCompanyId(req.body.companyId || req.body.company);
      const isActive = req.body.isActive;

      const job = await Job.findById(jobId).populate("company");

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (!req.user || req.user.role !== "EMPLOYER") {
        return res.status(403).json({ message: "Only employers can update jobs" });
      }

      if (!job.company || job.company.ownerId !== req.user.FireBaseId) {
        return res.status(403).json({ message: "You are not allowed to update this job" });
      }

      if (title !== undefined) {
        job.title = title;
      }
      if (description !== undefined) {
        job.description = description;
      }
      if (location !== undefined) {
        job.location = location;
      }
      if (category !== undefined) {
        job.category = category;
      }
      if (salaryFrom !== undefined) {
        job.salaryFrom = salaryFrom;
      }
      if (salaryTo !== undefined) {
        job.salaryTo = salaryTo;
      }
      if (salary !== undefined) {
        job.salary = salary;
      }
      if (isActive !== undefined) {
        job.isActive = isActive;
      }

      if (companyIdFromBody) {
        const company = await getOwnedCompany(companyIdFromBody, req.user.FireBaseId);
        if (!company) {
          return res.status(403).json({ message: "You are not allowed to move this job to another company" });
        }
        job.company = companyIdFromBody;
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

  deactivateJob: async function (req, res) {
    try {
      const jobId = req.params.jobId;

      const job = await Job.findById(jobId).populate("company");

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (!req.user || req.user.role !== "EMPLOYER") {
        return res.status(403).json({ message: "Only employers can deactivate jobs" });
      }

      if (!job.company || job.company.ownerId !== req.user.FireBaseId) {
        return res.status(403).json({ message: "You are not allowed to deactivate this job" });
      }

      job.isActive = false;
      await job.save();

      return res.status(200).json({
        message: "Job deactivated successfully",
        job: job
      });
    } catch (error) {
      console.error("deactivateJob error:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  },

  deleteJob: async function (req, res) {
    try {
      const jobId = req.params.jobId;

      const job = await Job.findById(jobId).populate("company");

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (!req.user || req.user.role !== "EMPLOYER") {
        return res.status(403).json({ message: "Only employers can delete jobs" });
      }

      if (!job.company || job.company.ownerId !== req.user.FireBaseId) {
        return res.status(403).json({ message: "You are not allowed to delete this job" });
      }

      await JobApplication.deleteMany({ jobId: job._id });
      await ChatMessage.deleteMany({ jobId: job._id });
      await Job.deleteOne({ _id: job._id });

      return res.status(200).json({
        message: "Job deleted successfully"
      });
    } catch (error) {
      console.error("deleteJob error:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  },

  getJobById: async function (req, res) {
    try {
      const job = await Job.findById(req.params.jobId).populate("company");

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      return res.json(job);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};