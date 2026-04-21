const User = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports = {

    // REGISTER
    register: async (req, res) => {
        try {
            const {
                FireBaseId,
                fullName,
                email,
                role,
                birthdate,
                address
            } = req.body;

            if (!FireBaseId || !email || !fullName) {
                return res.status(400).json({
                    message: "Missing required fields"
                });
            }

            const normalizedEmail = email.trim().toLowerCase();

            const existingUserByFirebaseId = await User.findOne({ FireBaseId });
            if (existingUserByFirebaseId) {
                return res.status(409).json({
                    message: "User already exists"
                });
            }

            const existingUserByEmail = await User.findOne({ email: normalizedEmail });
            if (existingUserByEmail) {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }

            const user = await User.create({
                FireBaseId,
                fullName,
                email: normalizedEmail,
                role: role || "JOB_SEEKER",
                birthdate,
                address
            });

            const token = jwt.sign(
                {
                    userId: user._id,
                    FireBaseId: user.FireBaseId,
                    role: user.role
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "7d"
                }
            );

            return res.status(201).json({
                message: "User registered",
                token,
                user
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

    // LOGIN
    login: async (req, res) => {
        try {
            const { FireBaseId } = req.body;

            if (!FireBaseId) {
                return res.status(400).json({
                    message: "FireBaseId required"
                });
            }

            const user = await User.findOne({ FireBaseId });

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const token = jwt.sign(
                {
                    userId: user._id,
                    FireBaseId: user.FireBaseId,
                    role: user.role
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "7d"
                }
            );

            return res.status(200).json({
                message: "Login successful",
                token,
                user
            });

        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    },

    // GET USER BY FIREBASE ID
    getUserByFireBaseId: async (req, res) => {
        try {
            const user = await User.findOne({
                FireBaseId: req.params.FireBaseId
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(user);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET USER BY MONGO ID
    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(user);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET ALL USERS
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

};