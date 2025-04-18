// /config/db.js
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

// ✅ NodeGenesis Universal Database
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Test Connection
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("✨===========================================✨");
    console.log("✅ NodeGenesis Universal Database Connected");
    console.log("✨ Database: " + process.env.DB_NAME);
    console.log("✨ Host: " + process.env.DB_HOST);
    console.log("✨===========================================✨");
    conn.release();
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  }
})();