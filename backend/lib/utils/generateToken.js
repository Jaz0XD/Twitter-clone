import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //? [Set to 15 days] In Milliseconds
    httpOnly: true, //* prevent XSS attacks
    sameSite: "strict", //* CSRF attacks cross-site
    secure: process.env.NODE_ENV !== "development",
  });
};
