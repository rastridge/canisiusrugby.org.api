const sendByElasticEmail = require("./sendByElasticEmail");

module.exports = sendEmail

function sendEmail (sendTo) {
	sendByElasticEmail(sendTo)
}
