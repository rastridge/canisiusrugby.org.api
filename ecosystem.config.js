module.exports = {
	apps: [
		{
			name: "crc_server",
			script: "./app.js",
			cron_restart: "0 */12 * * *",
		},
	],
};
