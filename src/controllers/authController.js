
const User = require("../models/User");
const Role = require("../models/Roles");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("role");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id),  
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Find role by name
    const roleDoc = await Role.findOne({ name: role.toUpperCase() });

    if (!roleDoc) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Create user (password auto hashed by pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role: roleDoc._id,
    });

    res.status(201).json({
      message: "User registered successfully",
      email: user.email,
      role: roleDoc.name,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};