import readline from "readline";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper to mask password input
function askHidden(question) {
  return new Promise(resolve => {
    const stdin = process.stdin;
    const stdout = process.stdout;
    let password = "";

    stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    const onData = char => {
      switch (char) {
        case "\n":
        case "\r":
        case "\u0004":
          stdin.setRawMode(false);
          stdin.pause();
          stdout.write("\n");
          stdin.removeListener("data", onData);
          resolve(password);
          break;
        case "\u0003": // Ctrl+C
          process.exit();
          break;
        default:
          stdout.write("*");
          password += char;
          break;
      }
    };

    stdin.on("data", onData);
  });
}

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function changePassword() {
  try {
    const username = await ask("Enter admin username: ");
    const newPassword = await askHidden("Enter new password: ");

    const hash = await bcrypt.hash(newPassword, 12);

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
      console.log("❌ Admin user not found.");
    } else {
      await db.execute(
        "UPDATE admin_users SET password_hash = ? WHERE username = ?",
        [hash, username]
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