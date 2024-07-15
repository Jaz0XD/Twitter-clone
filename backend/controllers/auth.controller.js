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
      // fullName: fullName,
      // username: username,
      // email: email,
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
    //* Log error in Console
    console.log(
      "[auth.controller.js] Error in signup controller,",
      error.message
    );

    //* Send error message to user
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//* The login endpoint

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    //? Log error in Console
    console.log(
      "[auth.controller.js] Error in login controller,",
      error.message
    );

    //* Sends Server Error to user
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//* The logout endpoint
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    //* Log error in Console
    console.log(
      "[auth.controller.js] Error in logout controller,",
      error.message
    );
    //* Send error message to user
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    //* Log error in Console
    console.log("Error in getMe controller", error.message);
    //* Send error message to user
    res.status(500).json({ error: "Internal Server Error" });
  }
};
