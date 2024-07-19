// Import Packages
import { v2 as cloudinary } from "cloudinary";

// Import models
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

//* CREATING POSTS

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    //* Check and find the existing user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    //* If no text or no image pop an error
    if (!text && !img) {
      return res.status(400).json({ error: "Post must have text or image" });
    }
    //* If Image upload it to cloudinary
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    //* Save the post to DB
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    //* Log error in Console
    console.log("[post.controller.js] Error in createPost controller: ", error);

    //* Send error message to user
    res.status(500).json({ error: "Internal Server error" });
  }
};

//* DELETING POSTS

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    //* Log error in Console
    console.log("[post.controller.js] Error in deletePost controller: ", error);

    //* Send error message to user
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//* COMMENT POSTS

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = { user: userId, text };

    //* Save comments to the DB
    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    //* Log error in Console
    console.log(
      "[post.controller.js] Error in commentOnPost controller: ",
      error
    );

    //* Send error message to user
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//* LIKE & UNLIKE POST

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      //* Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      //* Like post
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();

      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    //* Log error in Console
    console.log(
      "[post.controller.js] Error in likeUnlikePost controller: ",
      error
    );

    //* Send error message to user
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//* GET ALL POSTS

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        //select: ["-password", "-email"], //* If you want to remove both email and password
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    //* Log error in Console
    console.log(
      "[post.controller.js] Error in getAllPosts controller: ",
      error
    );

    //* Send error message to user
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//* GET LIKED POSTS

export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(likedPosts);
  } catch (error) {
    //* Log error in Console
    console.log(
      "[post.controller.js] Error in getLikedPosts controller: ",
      error
    );

    //* Send error message to user
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//* GET FOLLOWING POSTS

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(feedPosts);
  } catch (error) {
    //* Log error in Console
    console.log(
      "[post.controller.js] Error in getFollowingPosts controller: ",
      error
    );

    //* Send error message to user
    res.status(500).json({ error: "Internal Server Error" });
  }
};
