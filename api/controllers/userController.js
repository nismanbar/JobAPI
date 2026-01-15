const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = {

    register: async (req, res) => {
        try {
            const { fullName, email, password, role } = req.body;

            const exists = await User.findOne({ email });
            if (exists) {
                return res.status(400).json({ message: "Email already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                fullName,
                email,
                password: hashedPassword,
                role
            });

            await user.save();

            res.status(201).json({
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            });

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            res.json({
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            });

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const { userId } = req.params;

            const user = await User.findById(userId).select("-password");
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(user);

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await User.find().select("-password");
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};
