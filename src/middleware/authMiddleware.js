const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {

      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id)
        .populate("role")   
        .select("-password");

      next();
    } else {
      return res.status(401).json({ message: "Not authorized" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {

    const userRole = req.user.role.name;  // 🔥 use name field

    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};