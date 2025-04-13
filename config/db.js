// /config/db.js
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

// ✅ Main Application DB (Appointments, etc.)
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Admin Authentication DB
export const adminDB = mysql.createPool({
  host: process.env.ADMIN_DB_HOST,
  user: process.env.ADMIN_DB_USER,
  password: process.env.ADMIN_DB_PASSWORD,
  database: process.env.ADMIN_DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

// ✅ Test Connections
(async () => {
  try {
    const [conn1, conn2] = await Promise.all([
      db.getConnection(),
      adminDB.getConnection(),
    ]);
    console.log("✅ Main DB connected.");
    console.log("✅ Admin DB connected.");
    conn1.release();
    conn2.release();
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  }
})();
