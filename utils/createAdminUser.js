import readline from "readline";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question, { hideInput = false } = {}) {
  return new Promise(resolve => {
    if (!hideInput) {
      rl.question(question, resolve);
    } else {
      const stdin = process.stdin;
      const onDataHandler = char => {
        char = char + "";
        switch (char) {
          case "\n":
          case "\r":
          case "\u0004":
            stdin.pause();
            break;
          default:
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(question + "*".repeat(password.length));
            password += char;
            break;
        }
      };

      let password = "";
      process.stdout.write(question);
      stdin.on("data", onDataHandler);
      stdin.setRawMode(true);
      stdin.resume();

      stdin.once("end", () => resolve(password));
      stdin.once("keypress", () => {
        stdin.setRawMode(false);
        stdin.removeListener("data", onDataHandler);
        resolve(password);
      });

      rl.once("line", () => {
        stdin.setRawMode(false);
        stdin.removeListener("data", onDataHandler);
        resolve(password);
      });
    }
  });
}

async function createAdmin() {
  try {
    const siteKey = await ask("Enter site key (e.g. domtech): ");
    const username = await ask("Enter admin username: ");
    const password = await ask("Enter admin password: ", { hideInput: true });
    console.log(); // for newline
    const hash = await bcrypt.hash(password, 12);

    const db = await mysql.createConnection({
      host: process.env.ADMIN_DB_HOST,
      user: process.env.ADMIN_DB_USER,
      password: process.env.ADMIN_DB_PASSWORD,
      database: process.env.ADMIN_DB_NAME,
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