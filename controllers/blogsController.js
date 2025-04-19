import { db } from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const SITE_KEY = process.env.SITE_KEY;

// GET all blog posts
export const getAllBlogs = async (req, res) => {
  console.log("📥 GET /api/blogs hit");

  try {
    const [rows] = await db.execute(
      "SELECT * FROM blogs WHERE site_key = ? ORDER BY created_at DESC",
      [SITE_KEY]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching blogs:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST a new blog post
export const createBlogPost = async (req, res) => {
  console.log("🛠️ POST /api/blogs hit");
  console.log("📝 Payload:", req.body);

  const { title, author, summary, content } = req.body;

  if (!title || !author || !summary || !content) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await db.execute(
      `INSERT INTO blogs (site_key, title, author, summary, content) 
       VALUES (?, ?, ?, ?, ?)`,
      [SITE_KEY, title, author, summary, content]
    );
    res.status(201).json({ message: "Blog post created successfully" });
  } catch (err) {
    console.error("❌ Error creating blog post:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT to update a blog post
export const updateBlogPost = async (req, res) => {
  console.log("✏️ PUT /api/blogs/:id hit");
  const blogId = req.params.id;
  const { title, author, summary, content } = req.body;

  if (!title || !author || !summary || !content) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [result] = await db.execute(
      `UPDATE blogs 
       SET title = ?, author = ?, summary = ?, content = ?, updated_at = NOW() 
       WHERE id = ? AND site_key = ?`,
      [title, author, summary, content, blogId, SITE_KEY]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.status(200).json({ message: "Blog post updated successfully" });
  } catch (err) {
    console.error("❌ Error updating blog post:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};