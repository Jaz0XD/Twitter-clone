import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    //* If no token is given
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No Token Provided" });
    }

    //* If the given token is wrong
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }
    //* provide user details but excluding the password (does not send to the user)
    const user = await User.findById(decoded.userId).select("-password");

    //* If the user does not exist
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    //? Log error in Console
    console.log(
      "[protectRoute.js] Error in protectedRoute middleware",
      error.message
    );
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
