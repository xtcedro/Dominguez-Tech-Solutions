import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Admin Login
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const db = await mysql.createConnection({
      host: process.env.ADMIN_DB_HOST,
      user: process.env.ADMIN_DB_USER,
      password: process.env.ADMIN_DB_PASSWORD,
      database: process.env.ADMIN_DB_NAME,
    });

    const [rows] = await db.execute(
      "SELECT * FROM admin_users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password_hash);

    if (!match) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ message: "Login successful", token });
    await db.end();
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Change Admin Password
export const changeAdminPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.id;

    const db = await mysql.createConnection({
      host: process.env.ADMIN_DB_HOST,
      user: process.env.ADMIN_DB_USER,
      password: process.env.ADMIN_DB_PASSWORD,
      database: process.env.ADMIN_DB_NAME,
    });

    const [rows] = await db.execute("SELECT * FROM admin_users WHERE id = ?", [adminId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Admin user not found" });
    }

    const admin = rows[0];
    const match = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE admin_users SET password_hash = ? WHERE id = ?", [hashedPassword, adminId]);

    await db.end();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Password Change Error:", err.message);
    res.status(500).json({ error: "Failed to change password" });
  }
};