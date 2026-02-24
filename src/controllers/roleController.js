const Role = require("../models/Roles");

exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Role name is required",
      });
    }

    const validRoles = ["MANAGER", "SUPPORT", "USER"];

    if (!validRoles.includes(name)) {
      return res.status(400).json({
        message: "Invalid role name",
      });
    }

    const existingRole = await Role.findOne({ name });

    if (existingRole) {
      return res.status(400).json({
        message: "Role already exists",
      });
    }

    const role = await Role.create({ name });

    return res.status(201).json({
      message: "Role created successfully",
      role,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};