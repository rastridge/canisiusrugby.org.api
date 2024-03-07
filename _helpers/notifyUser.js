const sendByDreamhost = require("./sendByDreamhost")
const { FROM } = require('email_constants.json')

module.exports = notifyUser

async function notifyUser(msg, email) {
	sendByDreamhost(msg, FROM, email)
}
