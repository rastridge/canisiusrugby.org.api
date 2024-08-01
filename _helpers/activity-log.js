module.exports = activityLog;

const fs = require("fs");

function activityLog(filename, message, variable) {
	fs.appendFile(
		"/home/rastridge/api.canisiusrugby.org/logs/" + filename + ".txt",
		message + " " + variable + "\n",
		function (err) {
			if (err) throw err;
		}
	);
}
