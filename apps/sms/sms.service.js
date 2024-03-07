const doDBQuery = require("_helpers/do-query");
const fs = require('fs');
const { API_URL, DB_PREFIX, ACCOUNT_SID, AUTH_TOKEN, TWILIO_NUMBER } = require('config')

const twilioClient = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

module.exports = {
	getAll,
	getOne,
	addOne,
	editOne,
	sendSMS,
	messageStatus,
	deleteOne,
	getMemberTypes,
	changeStatus,
};

async function getAll() {

	const sql = `SELECT
								sms_id,
								sms_id as id,
								sms_member_type_id,
								sms_subject,
								sms_subject as title,
								sms_body_text,
								sms_sent,
								sms_send_complete,
								sms_recp_cnt,
								sms_err_cnt,
								sms_send_status,
								status,
								deleted,
								deleted_dt,
								created_dt,
								modified_dt,
								modified_dt as dt
							FROM ${DB_PREFIX}sms
							WHERE deleted = 0
							ORDER BY modified_dt DESC`;

	sms = await doDBQuery(sql);
	return sms;
}
async function getOne(id) {

	const sql = `select * from ${DB_PREFIX}sms where sms_id = ` + id;

	sms = await doDBQuery(sql);
	return sms[0];
}

async function addOne({ sms_member_type_id, sms_subject, sms_body_text }) {

	const sql = `INSERT INTO ${DB_PREFIX}sms
								SET
									sms_member_type_id = ?,
									sms_subject = ?,
									sms_body_text = ?,
									STATUS = 1,
									deleted = 0,
									created_dt = NOW(),
									modified_dt = NOW()`;

	let inserts = [];
	inserts.push(sms_member_type_id, sms_subject, sms_body_text);
	sms = await doDBQuery(sql, inserts);
	return sms
}

async function editOne({ sms_member_type_id, sms_subject, sms_body_text, id }) {
	const sql = `UPDATE ${DB_PREFIX}sms SET
								sms_member_type_id = ?,
								sms_subject = ?,
								sms_body_text = ?,
								modified_dt= NOW()
							WHERE sms_id = ?`;

	let inserts = [];
	inserts.push(sms_member_type_id, sms_subject, sms_body_text, id);

	sms = await doDBQuery(sql, inserts);
	return sms;
}
// need sms_id in parameters list
async function sendSMS({ id, sms_body_text, sms_recipients }) {
	const rec_cnt = sms_recipients.length
	sms_recipients.forEach(function (r) {
		/*
		fs.appendFile('/home/rastridge/api.canisiusrugby.org/logs/sendSMS.txt', id+' ' + r.account_addr_phone +'\n', function (err) {
			if (err) throw err;
		})
		*/
		const message = twilioClient.messages
			.create({
				body: sms_body_text,
				from: TWILIO_NUMBER,
				statusCallback: `${API_URL}/sms/MessageStatus`,
				to: r.account_addr_phone
			})
			.then((message) => console.log('SMS status=', message.status))
			.done()
	})

	const sql = `UPDATE ${DB_PREFIX}sms
								SET
									sms_send_status = 3,
									sms_sent = NOW(),
									sms_send_complete = NOW(),
									sms_recp_cnt = ${rec_cnt}
								WHERE sms_id = ${id}`

	sms = await doDBQuery(sql)
	return sms
}

async function messageStatus({ MessageSid, MessageStatus, To }) {

	const sql = `UPDATE ${DB_PREFIX}accounts
								SET account_textmsg_opening = NOW()
								WHERE
									'${MessageStatus}' = 'delivered'
									AND
									account_addr_phone = '${To}'`

	await doDBQuery(sql)
	res.sendStatus(200)
}

async function deleteOne(id) {
	const sql =
		`UPDATE ${DB_PREFIX}sms SET deleted=1, deleted_dt= NOW() WHERE sms_id=` + id
	sms = await doDBQuery(sql)
	return sms
}

async function changeStatus({ id, status }) {
	const sql =
		`UPDATE ${DB_PREFIX}sms SET STATUS = "` + status + `" WHERE sms_id  = ` + id
	account = await doDBQuery(sql)
	return account
}

async function getMemberTypes() {
	const sql = `SELECT * FROM ${DB_PREFIX}member_types WHERE 1`;
	membertypes = await doDBQuery(sql);
	return membertypes;
}
