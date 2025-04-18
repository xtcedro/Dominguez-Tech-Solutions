import { db } from "../config/db.js";

// GET /api/settings?site=heavenly
export const getSiteSettings = async (req, res) => {
  const siteKey = req.query.site || "domtech";

  try {
    const [rows] = await db.execute(
      "SELECT * FROM site_settings WHERE site_key = ? LIMIT 1",
      [siteKey]
    );

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
  const { heroHeadline, contactEmail, businessPhone } = req.body;

  if (!heroHeadline || !contactEmail || !businessPhone) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [existing] = await db.execute(
      "SELECT id FROM site_settings WHERE site_key = ?",
      [siteKey]
    );

    if (existing.length === 0) {
      await db.execute(
        `INSERT INTO site_settings (site_key, hero_headline, contact_email, business_phone)
         VALUES (?, ?, ?, ?)`,
        [siteKey, heroHeadline, contactEmail, businessPhone]
      );
    } else {
      await db.execute(
        `UPDATE site_settings
         SET hero_headline = ?, contact_email = ?, business_phone = ?
         WHERE site_key = ?`,
        [heroHeadline, contactEmail, businessPhone, siteKey]
      );
    }

    res.status(200).json({ message: `Settings updated for ${siteKey}` });
  } catch (err) {
    console.error("Error updating settings:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
