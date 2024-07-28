import User from '../models/userSchema.js';
import Post from '../models/postSchema.js';
import Notification from '../models/notificationSchema.js';
import { v2 as cloudinary } from 'cloudinary';

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate({
            path: 'user',
            select: '-password',

        })
        .populate({
            path: 'comments.user',
            select: '-password',
        });

        if (posts.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(posts);
    } catch (error) {
        console.log('Error in getAllPosts controller', error.message);
        res.status(500).json({ error: 'Server error'});
    };
}

export const getLikedPosts = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if(!user) return res.status(404).json({ error: 'User not found' });

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
        .populate({
            path: 'user',
            select: '-password',

        })
        .populate({
            path: 'comments.user',
            select: '-password',
        });

        res.status(200).json(likedPosts);
    } catch (error) {
        console.log('Error in getLikedPost controller', error.message);
        res.status(500).json({ error: 'Server error'});
    }
}

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;

        if (!text && !img) {
            return res.status(400).json({ error: 'Post must have text or image' });
        }

        let imageUrl = '';
        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
			imageUrl = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: req.user._id,
            text,
            img: imageUrl,
        });

        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        console.log('Error in createPost controller', error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ error: 'Post not found' });

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            // unlike post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId }});
            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);
        } else {
            // like post
            post.likes.push(userId);
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId }});
            await post.save();

            // send notification
            const notification = new Notification({
                from: userId,
                to: post.user,
                type: 'like',
            });
            await notification.save();
            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes);
        }
    } catch (error) {
        console.log('Error in likeUnlikePost controller', error.message);
        res.status(500).json({ error: 'Server error'});
    };
};

export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text && !img) {
            return res.status(400).json({ error: 'Post must have text or image' });
        }

        if (!text) return res.status(404).json({ error: 'Text field is required' });

        let imageUrl = '';
        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
			imageUrl = uploadedResponse.secure_url;
        }

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        
        const comment = new Post({
            user: userId,
            text,
            img: imageUrl,
        });

        post.comments.push(comment);
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        console.log('Error in commentPost controller', error.message);
        res.status(500).json({ error: 'Server error'});
    };
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ error: 'Post not found' });

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'You are not authorised to delete this post'});
        }

        if (post.img) {
            const imgId = post.img.split('/').pop().split('/')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.log('Error in deletePost controller', error.message);
        res.status(500).json({ error: 'Server error'});
    };
};

export const deleteComment = async (req, res) => {
    try {
        const userId = req.user._id;
        // Find the post containing the comment
        const post = await Post.findOne({ "comments._id": req.params.id });
        
        if (!post) return res.status(404).json({ error: 'Comment not found' });

        // Find the comment within the post
        const comment = post.comments.id(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        // Authorisation check
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'You are not authorised to delete this comment' });
        }

        // Delete the image if exists
        if (comment.img) {
            const imgId = comment.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }
        
        post.comments.pull(comment);
        await post.save();

        const updatedComments = post.comments.filter((id) => id.toString() !== userId.toString());
        res.status(200).json(updatedComments);
    } catch (error) {
        console.log('Error in deleteComment controller', error.message);
        res.status(500).json({ error: 'Server error'});
    };
};

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await  User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const following = user.following;

        const feedPosts = await Post.find({ user: { $in: following } })
        .sort({ createAt: -1 })
        .populate({
            path: 'user',
            select: '-password',
        })
        .populate({
            path: 'comments.user',
            select: '-password',
        });


        res.status(200).json(feedPosts);
    } catch (error) {
        console.log('Error in getFollowingPosts controller', error.message);
        res.status(500).json({ error: 'Server error'});
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const userPosts = await Post.find({ user: user._id })
        .sort({ createAt: -1 })
        .populate({
            path: 'user',
            select: '-password',
        })
        .populate({
            path: 'comments.user',
            select: '-password',
        });


        res.status(200).json(userPosts);
    } catch (error) {
        console.log('Error in getUserPosts controller', error.message);
        res.status(500).json({ error: 'Server error'});
    }
}