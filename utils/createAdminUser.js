// /cli/createAdminUser.js
import readline from "readline";
import bcrypt from "bcrypt";
import { db } from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Ask standard input
function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

// Ask hidden input without displaying characters at all
function askHidden(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    let password = "";

    stdin.on("data", function (char) {
      switch (char) {
        case "\r":
        case "\n":
        case "\u0004":
          stdin.setRawMode(false);
          stdin.pause();
          process.stdout.write("\n");
          resolve(password);
          break;
        case "\u0003": // Ctrl+C
          process.exit();
          break;
        case "\u0008":
        case "\u007F": // Backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
          }
          break;
        default:
          password += char;
          break;
      }
    });
  });
}

// Create admin user
async function createAdmin() {
  try {
    const siteKey = await ask("Enter site key (e.g. domtech): ");
    const username = await ask("Enter admin username: ");
    const password = await askHidden("Enter admin password: ");
    const hash = await bcrypt.hash(password, 12);

    await db.execute(
      "INSERT INTO admin_users (site_key, username, password_hash) VALUES (?, ?, ?)",
      [siteKey, username, hash]
    );

    console.log("\n✅ Admin created successfully.");
  } catch (err) {
    console.error("\n❌ Error:", err.message);
  } finally {
    rl.close();
  }
}

createAdmin();