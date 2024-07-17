import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createPost,
  //   likeUnlikePost,
  //   commentOnPost,
  deletePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createPost); //* Creating a post
// router.post("/like/:id", protectRoute, likeUnlikePost); //* Liking and Disliking a post
// router.post("/comment/:id", protectRoute, commentOnPost); //* Commenting on a post
router.delete("/:id", protectRoute, deletePost); //* Deleting a post

export default router;
