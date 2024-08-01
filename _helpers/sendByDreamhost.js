const nodemailer = require('nodemailer')
const { DH_SMTP_HOST, DH_SMTP_PORT, DH_SMTP_SECURE, DH_SMTP_USER, DH_SMTP_PASS } = require('config');

module.exports = sendByDreamhost

async function sendByDreamhost(msg, from, email) {

	let transporter = nodemailer.createTransport({
			host: DH_SMTP_HOST,
			port: DH_SMTP_PORT,
			secure: DH_SMTP_SECURE,
			auth: {
				user: DH_SMTP_USER,
				pass: DH_SMTP_PASS
			}
	})

	let info = await transporter.sendMail({
			from: from, // sender address
			to: email , // list of receivers
			subject: 'Notification', // Subject line
			text: msg, // plain text body
			html: '<h4> ' + msg + '</h4>' // html body
	})
}
