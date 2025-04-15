-- ========================================================
--  Dominguez Tech Solutions Appointment Database
-- ========================================================

CREATE DATABASE IF NOT EXISTS domtech_appointments;
USE domtech_appointments;

CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    service VARCHAR(255) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_appointment (email, service, created_at),
    INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS chat_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    user_message TEXT NOT NULL,
    bot_reply TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- Admin User Database (NEW)
-- Created: 2025-03-27
-- ========================================================

CREATE DATABASE IF NOT EXISTS admin_db;
USE admin_db;


CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    site_key VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_site_user (site_key, username)
);

-- Assumes you're already connected to your database (e.g. genesis_db)

CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  site_key VARCHAR(50) NOT NULL UNIQUE, -- New: Unique identifier for each site
  site_title VARCHAR(100) NOT NULL,
  contact_email VARCHAR(100) NOT NULL,
  business_phone VARCHAR(20) NOT NULL,
  homepage_banner TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



-- Create the blogs table
CREATE TABLE blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100) NOT NULL,
  summary TEXT NOT NULL,
  content LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  location VARCHAR(150) NOT NULL,
  image VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================================
-- Create User & Grant Privileges
-- ========================================================

CREATE USER IF NOT EXISTS 'webadmin'@'localhost' IDENTIFIED BY 'Password123!';

GRANT ALL PRIVILEGES ON domtech_appointments.* TO 'webadmin'@'localhost';
GRANT ALL PRIVILEGES ON admin_db.* TO 'webadmin'@'localhost';

FLUSH PRIVILEGES;
