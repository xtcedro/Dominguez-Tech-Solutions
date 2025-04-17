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

async function changePassword() {
  try {
    const siteKey = await ask("Enter site key: ");
    const newPassword = await ask("Enter new password: ");
    const username = "admin";

    const hash = await bcrypt.hash(newPassword, 12);

    const db = await mysql.createConnection({
      host: process.env.ADMIN_DB_HOST,
      user: process.env.ADMIN_DB_USER,
      password: process.env.ADMIN_DB_PASSWORD,
      database: process.env.ADMIN_DB_NAME,
    });

    const [rows] = await db.execute(
      "SELECT * FROM admin_users WHERE site_key = ? AND username = ?",
      [siteKey, username]
    );

    if (rows.length === 0) {
      console.log("❌ Admin user not found for the given site key.");
    } else {
      await db.execute(
        "UPDATE admin_users SET password_hash = ? WHERE site_key = ? AND username = ?",
        [hash, siteKey, username]
      );
      console.log("✅ Password updated successfully.");
    }

    await db.end();
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    rl.close();
  }
}

changePassword();