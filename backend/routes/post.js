import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { 
    getAllPosts, 
    getLikedPosts, 
    createPost, 
    likeUnlikePost, 
    commentOnPost, 
    deletePost,
    deleteComment,
    getFollowingPosts,
    getUserPosts,
} from '../controllers/post.js';

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);
router.delete("/comment/:id", protectRoute, deleteComment);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/user/:username", protectRoute, getUserPosts);

export default router;