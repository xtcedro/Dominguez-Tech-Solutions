const API_BASE_URL = window.location.origin.includes("localhost")
  ? "http://localhost:3000"
  : "https://www.domingueztechsolutions.com";

const postSelect = document.getElementById("postSelect");
const editForm = document.getElementById("editBlogForm");
const editBlogMessage = document.getElementById("editBlogMessage");

// Fields
const titleField = document.getElementById("editTitle");
const authorField = document.getElementById("editAuthor");
const summaryField = document.getElementById("editSummary");
const contentField = document.getElementById("editContent");

let selectedPostId = null;

// Fetch all blog posts and populate dropdown
async function loadBlogPosts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/blogs`);
    const posts = await res.json();

    postSelect.innerHTML = `<option disabled selected value="">Select a blog post...</option>`;
    posts.forEach((post) => {
      const option = document.createElement("option");
      option.value = post.id;
      option.textContent = `${post.title} — by ${post.author}`;
      postSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading posts:", error);
    postSelect.innerHTML = `<option disabled>Error loading posts</option>`;
  }
}

// When a blog post is selected
postSelect.addEventListener("change", async (e) => {
  const postId = e.target.value;
  if (!postId) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/blogs`);
    const posts = await res.json();
    const post = posts.find((p) => p.id == postId);

    if (post) {
      selectedPostId = postId;
      titleField.value = post.title;
      authorField.value = post.author;
      summaryField.value = post.summary;
      contentField.value = post.content;
    }
  } catch (err) {
    console.error("Failed to load selected post:", err);
  }
});

// Handle blog update
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!selectedPostId) {
    editBlogMessage.textContent = "❗ Please select a blog post to edit.";
    editBlogMessage.style.display = "block";
    return;
  }

  const updatedPost = {
    title: titleField.value.trim(),
    author: authorField.value.trim(),
    summary: summaryField.value.trim(),
    content: contentField.value.trim(),
  };

  try {
    const token = localStorage.getItem("adminToken");

    const res = await fetch(`${API_BASE_URL}/api/blogs/${selectedPostId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedPost),
    });

    const data = await res.json();

    editBlogMessage.textContent = res.ok
      ? "✅ Blog post updated successfully!"
      : `❌ ${data.error}`;
    editBlogMessage.style.display = "block";
  } catch (err) {
    console.error("Update failed:", err);
    editBlogMessage.textContent = "❌ Server error while updating post.";
    editBlogMessage.style.display = "block";
  }
});

document.addEventListener("DOMContentLoaded", loadBlogPosts);