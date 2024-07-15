// Import Packages
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

// Import models
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

//* Getting user profile

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    //* Log error in Console
    console.log(
      "[user.controller.js] Error in getUserProfile: ",
      error.message
    );
    //* Send error message to user
    res.status(500).json({ error: error.message });
  }
};

//* Following and Unfollowing

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    //* Check Self follow & unfollow is removed
    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can not follow/unfollow yourself" });
    }
    //* Check Availablility of User
    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);

    //* If following then unfollow
    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      //TODO return the id of the user as a response
      res.status(200).json({ message: "User unfollowed successfully" });
    }
    //* If not following then follow
    else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      //* Sends notification to the user
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      await newNotification.save(); //* Saves the notification to the DB

      //TODO return the id of the user as a response
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    //* Log error in Console
    console.log(
      "[user.controller.js] Error in followUnfollowUser: ",
      error.message
    );
    //* Send error message to user
    res.status(500).json({ error: error.message });
  }
};

//* Getting suggested users

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    //* Log error in Console
    console.log(
      "[user.controller.js] Error in getSuggestedUsers: ",
      error.message
    );
    //* Send error message to user
    res.status(500).json({ error: error.message });
  }
};

//* Updating user details (Update Profile)

export const updateUser = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  try {
    //* Check and find the existing user
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // PASSWORD UPDATE

    //* If either new password is not provided or current password is not provided then return error
    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Current password is incorrect" });
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // PROFILE IMAGE

    if (profileImg) {
      //* Delete previous Profile Image (To avoid excess memory usage in DB)
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      //* Uploading the new Profile Image
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    // COVER IMAGE

    if (coverImg) {
      //* Delete previous Cover Image (To avoid excess memory usage in DB)
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      //* Uploading the new Cover Image
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    //* Update details or keep the same from DB

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save(); //* Save everything to DB

    user.password = null; //* Password should be null in the response

    return res.status(200).json(user);
  } catch (error) {

    //* Log error in Console
    console.log("[user.controller.js] Error in updateUser: ", error.message);

    //* Send error message to user
    res.status(500).json({ error: error.message });
  }
};
