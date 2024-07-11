// SIGNUP LOGIN and LOGOUT

import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

//* The signup endpoint

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    //* To check for correct email format

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    //* To check if the username already exists or not
    //* Two users can not have same username

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    //* To check if email is already used in another account

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already in Use" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    //* Hashing the Password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      //? fullName: fullName,
      //? username: username,
      //? email: email,
      // password: hashedPassword

      //* Since we use the same var for fullName, username and email it can be shortened
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    //TODO Temporary console log
    console.log(
      "[auth.controller.js] Error in signup controller,",
      error.message
    );

    //* Sends Server Error to user
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//* The login endpoint

export const login = async (req, res) => {
  res.json({
    data: "You hit the login endpoint",
  });
};

//* The logout endpoint
export const logout = async (req, res) => {
  res.json({
    data: "You hit the logout endpoint",
  });
};
