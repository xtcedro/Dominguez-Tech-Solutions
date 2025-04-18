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
        case "\n":
        case "\r":
        case "\u0004":
          stdin.setRawMode(false);
          stdin.pause();
          process.stdout.write("\n");
          resolve(password);
          break;
        case "\u0003": // Ctrl+C
          process.exit();
          break;
        default:
          process.stdout.write("*");
          password += char;
          break;
      }
    });
  });
}

async function createAdmin() {
  try {
    const siteKey = await ask("Enter site key (e.g. domtech): ");
    const username = await ask("Enter admin username: ");
    const password = await askHidden("Enter admin password: ");
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

    console.log("\n✅ Admin created in MySQL.");
    await db.end();
  } catch (err) {
    console.error("\n❌ Error:", err.message);
  } finally {
    rl.close();
  }
}

createAdmin();