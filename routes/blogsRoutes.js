import express from "express";
import {
  getAllBlogs,
  createBlogPost,
  updateBlogPost
} from "../controllers/blogsController.js";

const router = express.Router();

// GET all blogs
router.get("/", (req, res, next) => {
  console.log("📡 [GET] /api/blogs - Fetching all blog posts...");
  getAllBlogs(req, res, next);
});

// POST a new blog
router.post("/", (req, res, next) => {
  console.log("📝 [POST] /api/blogs - Creating a new blog post...");
  console.log("📦 Request Body:", req.body);
  createBlogPost(req, res, next);
});

// PUT update a blog
router.put("/:id", (req, res, next) => {
  console.log(`✏️ [PUT] /api/blogs/${req.params.id} - Updating blog post...`);
  console.log("🛠️ Updated Data:", req.body);
  updateBlogPost(req, res, next);
});

export default router;
