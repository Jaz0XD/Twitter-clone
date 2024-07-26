import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getUserProfile,
  getExploreUsers,
} from "../controllers/explore.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile); //* Getting the user name
router.get("/suggested", protectRoute, getExploreUsers); //* Getting suggested users

export default router;
