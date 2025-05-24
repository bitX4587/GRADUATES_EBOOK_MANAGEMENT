import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware to protect routes
export const isLogin = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    if (decoded.role === "admin") {
      req.admin = decoded;
    } else {
      req.user = decoded;
    }
    next();
  });
};

// Route handler for logout (not middleware)
export const isLogout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
};
