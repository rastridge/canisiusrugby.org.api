// config.js
require("dotenv").config();

module.exports = {
	API_URL: process.env.API_URL,
	PORT: process.env.PORT,
	// website
	SITE_URL: process.env.SITE_URL,
	SITE_DIR: process.env.SITE_DIR,
	// port: process.env.PORT,
	// twilio texts
	ACCOUNT_SID: process.env.ACCOUNT_SID,
	AUTH_TOKEN: process.env.AUTH_TOKEN,
	TWILIO_NUMBER: process.env.TWILIO_NUMBER,
	// mysql DB
	DB: {
		DB_HOST: process.env.DB_HOST,
		DB_USER: process.env.DB_USER,
		DB_PASSWORD: process.env.DB_PASSWORD,
		DB_DATABASE: process.env.DB_DATABASE,
	},
	DB_PREFIX: process.env.DB_PREFIX,
	// Elastic Email
	EE_USERNAME: process.env.EE_USERNAME,
	EE_API_KEY: process.env.EE_API_KEY,
	// JWToken
	JWT_SECRET: process.env.JWT_SECRET,
	// dreamhost smtp
	DH_SMTP_HOST: process.env.DH_SMTP_HOST,
	DH_SMTP_PORT: parseInt(process.env.DH_SMTP_PORT),
	DH_SMTP_SECURE: parseInt(process.env.DH_SMTP_SECURE),
	DH_SMTP_USER: process.env.DH_SMTP_USER,
	DH_SMTP_PASS: process.env.DH_SMTP_PASS,
	// image file locations
	SITE_IMAGE_PATH: process.env.SITE_IMAGE_PATH,
	TEMP_DIR: process.env.TEMP_DIR,
	WOF: process.env.WOF,
	CLUBHOUSE: process.env.CLUBHOUSE,
	SPONSORS: process.env.SPONSORS,
	NEWS_NEWSLETTERS: process.env.NEWS_NEWSLETTERS,
	SITE_ARCHIVE_PATH: process.env.SITE_ARCHIVE_PATH,
	SITE_BASE_PATH: process.env.SITE_BASE_PATH,
	ORGANIZATION: process.env.ORGANIZATION,
	ORGANIZATION_EMAIL: process.env.ORGANIZATION_EMAIL,
};
