const User = require("../models/User");
const Role = require("../models/Roles");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔥 Find role by name
    const roleDoc = await Role.findOne({ name: role });

    if (!roleDoc) {
      return res.status(400).json({ message: "Role not found" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: roleDoc._id   // 🔥 Save ObjectId
    });

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("role", "name");

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};