const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

module.exports = {

    register: async (req, res) => {

        try {

            if (!id)
                return res.status(400).json({ message: "Firebase UID required" });

            let existingUser = await User.findById(id);

            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            let user = new User({
                _id: id,
                fullName,
                email,
                role
            });

            await user.save();
          

            res.status(200).json(user);

        } catch (err) {

            res.status(500).json({ message: err.message });

        }

    },

    // NEW LOGIN FUNCTION (create JWT only)
    login: async (req, res) => {

        try {

            const { id } = req.body;

            if (!id)
                return res.status(400).json({ message: "User id required" });

            const user = await User.findById(id);

            if (!user)
                return res.status(404).json({ message: "User not found" });

            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    role: user.role
                },
                JWT_SECRET,
                {
                    expiresIn: "30d"
                }
            );

            res.json({
                token,
                user
            });

        } catch (err) {

            res.status(500).json({ message: err.message });

        }

    },

    getUserById: async (req, res) => {

        try {

            const user = await User.findById(req.params.userId);

            if (!user)
                return res.status(404).json({ message: "User not found" });

            res.json(user);

        } catch (err) {

            res.status(500).json({ message: err.message });

        }

    },

    getAllUsers: async (req, res) => {

        try {

            const users = await User.find();

            res.json(users);

        } catch (err) {

            res.status(500).json({ message: err.message });

        }

    }

};