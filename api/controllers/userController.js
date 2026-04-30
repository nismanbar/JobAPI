const User = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports = {
  register: async function (req, res) {
    try {
      const FireBaseId = req.body.FireBaseId;
      const fullName = req.body.fullName;
      const email = req.body.email;
      const role = req.body.role;
      const birthdate = req.body.birthdate;
      const address = req.body.address;

      if (!FireBaseId || !email || !fullName) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const normalizedEmail = email.trim().toLowerCase();

      const existingUserByFirebaseId = await User.findOne({ FireBaseId: FireBaseId });
      if (existingUserByFirebaseId) {
        return res.status(409).json({ message: "User already exists" });
      }

      const existingUserByEmail = await User.findOne({ email: normalizedEmail });
      if (existingUserByEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const user = await User.create({
        FireBaseId: FireBaseId,
        fullName: fullName,
        email: normalizedEmail,
        role: role || "JOB_SEEKER",
        birthdate: birthdate || "",
        address: address || "",
        photoUrl: "",
        resumeUrl: "",
        resumeName: ""
      });

      const token = jwt.sign(
        {
          userId: user._id,
          FireBaseId: user.FireBaseId,
          role: user.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        message: "User registered",
        token: token,
        user: user
      });
    } catch (error) {
      if (error && error.code === 11000) {
        return res.status(409).json({
          message: "Duplicate field",
          error: error.keyValue || error.message
        });
      }

      return res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  },

  login: async function (req, res) {
    try {
      const FireBaseId = req.body.FireBaseId;

      if (!FireBaseId) {
        return res.status(400).json({ message: "FireBaseId required" });
      }

      const user = await User.findOne({ FireBaseId: FireBaseId });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          FireBaseId: user.FireBaseId,
          role: user.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        message: "Login successful",
        token: token,
        user: user
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  },

  getUserByFireBaseId: async function (req, res) {
    try {
      const user = await User.findOne({ FireBaseId: req.params.FireBaseId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  updateUserByFireBaseId: async function (req, res) {
    try {
      const FireBaseId = req.params.FireBaseId;
      const fullName = req.body.fullName;
      const birthdate = req.body.birthdate;
      const address = req.body.address;
      const photoUrl = req.body.photoUrl;
      const resumeUrl = req.body.resumeUrl;
      const resumeName = req.body.resumeName;

      const user = await User.findOne({ FireBaseId: FireBaseId });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (fullName !== undefined) {
        user.fullName = fullName;
      }
      if (birthdate !== undefined) {
        user.birthdate = birthdate;
      }
      if (address !== undefined) {
        user.address = address;
      }
      if (photoUrl !== undefined) {
        user.photoUrl = photoUrl;
      }
      if (resumeUrl !== undefined) {
        user.resumeUrl = resumeUrl;
      }
      if (resumeName !== undefined) {
        user.resumeName = resumeName;
      }

      await user.save();

      return res.status(200).json({
        message: "User updated successfully",
        user: user
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  },

  getUserById: async function (req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getAllUsers: async function (req, res) {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};