import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({
      message: "Unautorized",
    });
  }

  try {
    // token yang dikirimkan valid atau tidak
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // jika valid cari user siapa
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
