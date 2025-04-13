import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.ADMIN_DB_HOST,
  user: process.env.ADMIN_DB_USER,
  password: process.env.ADMIN_DB_PASSWORD,
  database: process.env.ADMIN_DB_NAME,
};

// GET /api/settings?site=heavenly
export const getSiteSettings = async (req, res) => {
  const siteKey = req.query.site || "domtech";

  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute("SELECT * FROM site_settings WHERE site_key = ? LIMIT 1", [siteKey]);
    await db.end();

    if (rows.length === 0) {
      return res.status(404).json({ error: `Settings not found for ${siteKey}` });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error fetching settings:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/settings?site=heavenly
export const updateSiteSettings = async (req, res) => {
  const siteKey = req.query.site || "domtech";
  const { siteTitle, contactEmail, businessPhone, homepageBanner } = req.body;

  if (!siteTitle || !contactEmail || !businessPhone || !homepageBanner) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const db = await mysql.createConnection(dbConfig);

    const [existing] = await db.execute("SELECT id FROM site_settings WHERE site_key = ?", [siteKey]);

    if (existing.length === 0) {
      await db.execute(
        `INSERT INTO site_settings (site_key, site_title, contact_email, business_phone, homepage_banner)
         VALUES (?, ?, ?, ?, ?)`,
        [siteKey, siteTitle, contactEmail, businessPhone, homepageBanner]
      );
    } else {
      await db.execute(
        `UPDATE site_settings SET site_title = ?, contact_email = ?, business_phone = ?, homepage_banner = ?
         WHERE site_key = ?`,
        [siteTitle, contactEmail, businessPhone, homepageBanner, siteKey]
      );
    }

    await db.end();
    res.status(200).json({ message: `Settings updated for ${siteKey}` });
  } catch (err) {
    console.error("Error updating settings:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};