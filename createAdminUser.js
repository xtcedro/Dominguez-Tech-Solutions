import readline from "readline";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function createAdmin() {
  try {
    const siteKey = await ask("Enter site key (e.g. domtech): ");
    const username = await ask("Enter admin username: ");
    const password = await ask("Enter admin password: ");
    const hash = await bcrypt.hash(password, 12);

    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await db.execute(
      "INSERT INTO admin_users (site_key, username, password_hash) VALUES (?, ?, ?)",
      [siteKey, username, hash]
    );

    console.log("✅ Admin created in MySQL.");
    await db.end();
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    rl.close();
  }
}

createAdmin();
