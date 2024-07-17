// Import Packages
import { v2 as cloudinary } from "cloudinary";

// Import models
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
    console.log("Error in deletePost controller: ", error);

    //* Send error message to user
    res.status(500).json({ error: "Internal Server Error" });
  }
};
