import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  followUnfollowUser,
  getUserProfile,
  getSuggestedUsers,
  updateUser
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile); //* Getting the user name
router.get("/suggested", protectRoute, getSuggestedUsers); //* Getting suggested users
router.post("/follow/:id", protectRoute, followUnfollowUser); //* Following and unfollowing a user
router.post("/update", protectRoute, updateUser); //*

export default router;
