import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Notification from "../models/notificationModel.js";

import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User Not Found" });

    if (!text && !img) {
      return res.status(400).json({ message: "Post must have text or img" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();

    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in createPost controller: ", error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    // console.log(post);
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    // compare to current user id or in mongoDB saved user id , same or not
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.img) {
      let imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post Deleted Successfully" });
  } catch (error) {
    console.log("Error in deletePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: postId } = req.params;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ message: "Text field is Required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in commentOnPost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      res.status(200).json(updatedLikes);
    } else {
      // Like post
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();

      const updatedLikes = post.likes;
      res.status(200).json(updatedLikes);
    }
  } catch (error) {
    console.log("Error in likeUnlikePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLikedPost = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const likedPosts = await Post.find({
      _id: { $in: user.likedPosts },
    })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error in getLikedPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFollowingPosts = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Founds" });
    }
    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({
        createdAt: -1,
      })
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
    console.log("Error in getFollowingPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getUserPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
