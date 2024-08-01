const { EE_USERNAME, EE_API_KEY } = require("config");
const querystring = require("querystring");
const https = require("https");
// const activityLog = require("./activity-log");

module.exports = sendByElasticEmail;

function sendByElasticEmail(sendTo) {
	// activityLog("newsletter", "start sendByElasticEmail", sendTo.to);
	const post_data = querystring.stringify({
		username: EE_USERNAME,
		api_key: EE_API_KEY,
		from: sendTo.from,
		from_name: sendTo.from_name,
		to: sendTo.to,
		subject: sendTo.subject,
		body_html: sendTo.body_html,
		body_text: sendTo.body_text,
		isTransactional: false,
	});

	const post_options = {
		host: "api.elasticemail.com",
		path: "/v2/email/send",
		port: "443",
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Content-Length": post_data.length,
		},
	};

	let result = "";
	// Create the request object.
	const post_req = https.request(post_options, function (res) {
		// activityLog('newsletter', 'in https.request ', `statusCode: ${res.statusCode}`)
		res.setEncoding("utf8");
		res.on("data", function (chunk) {
			result = chunk;
			// activityLog(
			// 	"newsletter",
			// 	"in in https.request res.on(data",
			// 	sendTo.to + "#################" + result
			// );
		});
		res.on("error", function (e) {
			result = "Error: " + e.message;
			// activityLog(
			// 	"newsletter",
			// 	"in https.request res.on(error",
			// 	sendTo.to + "================" + result
			// );
		});
	});

	// Post to Elastic Email
	post_req.write(post_data);
	post_req.end();
	// activityLog("newsletter", "end sendByElasticEmail", sendTo.to);

	return result;
}
