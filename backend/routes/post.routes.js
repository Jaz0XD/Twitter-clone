import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createPost,
  likeUnlikePost,
  commentOnPost,
  deletePost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.post("/create", protectRoute, createPost); //* Creating a post
router.post("/like/:id", protectRoute, likeUnlikePost); //* Liking and Disliking a post
router.post("/comment/:id", protectRoute, commentOnPost); //* Commenting on a post
router.delete("/:id", protectRoute, deletePost); //* Deleting a post

export default router;
