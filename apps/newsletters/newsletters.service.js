const mysql = require("mysql2/promise");
const fs = require('fs');
const moment = require('moment')
const {
	NEWSLETTER_BEGIN_STYLES,
	NEWSLETTER_MID_STYLES,
	NEWSLETTER_END_STYLES,
	FROM,
	FROM_NAME,
} = require("email_constants.json");
const { DB_PREFIX, DB, API_URL} = require("config");
const doDBQuery = require("_helpers/do-query");
const sendEmail = require("_helpers/sendEmail");
const activityLog = require("_helpers/activity-log");

module.exports = {
	getAll,
	sendNewsletter,
	trackNewsletter,
	getOne,
	addOne,
	editOne,
	deleteOne,
	changeStatus,
	getRecipientTypes,
};

async function getAll() {
	const sql = `SELECT
								newsletter_id,
								newsletter_id as id,
								newsletter_recipient_type_id,
								admin_user_id,
								newsletter_subject,
								newsletter_subject as title,
								newsletter_sent as sent_dt,
								status,
								deleted,
								deleted_dt,
								created_dt,
								modified_dt,
								modified_dt as dt
							FROM
								${DB_PREFIX}newsletters
							WHERE
								deleted = 0
							ORDER BY dt DESC`;

	newsletter = await doDBQuery(sql);

	return newsletter;
}

async function sendNewsletter({
	id,
	newsletter_body_html,
	newsletter_subject,
	recipients,
}) {
	const rec_cnt = recipients.length;
	let recips = 0
	recipients.forEach(function (r) {
		// img src is an Endpoint
		const trackingpixel = `<img src="${API_URL}/newsletters/track?account_id=${r.account_id}&newsletter_id=${id}" height="1" width="1" alt="" />`;
		const accountinfo = `<br><hr><br><h4>This is Your Current Contact Info. Please <a href="https://canisiusrugby.org/register/men/${r.account_id}" target="_blank"> update your info if necessary</a></h4><table><tbody><tr><td>${r.member_firstname} ${r.member_lastname}</td></tr><tr><td>${r.account_addr_street}</td></tr><tr><td>${r.account_addr_street_ext}</td></tr><tr><td>${r.account_addr_city}, ${r.account_addr_state} ${r.account_addr_postal}</td></tr><tr><td>${r.account_addr_country}</td></tr><tr><td>${r.account_addr_phone}</td></tr><tr><td>${r.member_year}</td></tr><tr><td>${r.member_prev_club}</td></tr></tbody></table><br><hr><br>`;
		const sendTo = {
			from: FROM,
			fromName: FROM_NAME,
			to: r.account_email,
			subject: newsletter_subject,
			body_text: "HTML capable mail reader required",
			body_html:
				NEWSLETTER_BEGIN_STYLES +
				trackingpixel +
				NEWSLETTER_MID_STYLES +
				newsletter_body_html +
				accountinfo +
				NEWSLETTER_END_STYLES
		}
		recips++
		// activityLog('newsletter', 'in sendnewsletter send to', sendTo.to+' '+recips+' '+rec_cnt)

		sendEmail(sendTo);
	})

	const sql = `UPDATE ${DB_PREFIX}newsletters
								SET
								newsletter_sent = NOW(),
								newsletter_send = NOW(),
								newsletter_send_complete = NOW(),
								newsletter_send_status = 3,
								newsletter_recp_cnt = ${rec_cnt}
								WHERE newsletter_id = ${id}`;

	newsletters = await doDBQuery(sql);
	return newsletters;
}

async function getOne(id) {
	const sql =
		`select * from ${DB_PREFIX}newsletters where newsletter_id = ` + id;
	newsletter = await doDBQuery(sql);
	console.log(newsletter[0]);
	return newsletter[0];
}

/* trackNewsletter */
async function trackNewsletter(params) {
	const date = moment().format()
	/*	*/
	fs.appendFile('/home/rastridge/api.my-test-site.net/logs/trackNewsletter.txt', date+' newsletter_id='+params.newsletter_id+' account_id='+params.account_id+'\n', function (err) {
		if (err) throw err;
	})

	const conn = await mysql.createConnection({
		host: DB.DB_HOST,
		user: DB.DB_USER,
		password: DB.DB_PASSWORD,
		database: DB.DB_DATABASE,
	});

	try {
		await conn.query("START TRANSACTION");

		// update member last email opened date
		let sql = `UPDATE ${DB_PREFIX}accounts
					SET
						account_email_opening = NOW()
					WHERE
						account_id = ?`;

		let inserts = [];
		inserts.push(params.account_id);
		sql = mysql.format(sql, inserts);
		await conn.execute(sql);

		// Check if Newsletter already logged for this account in _newsletter_openings ?
		sql = `SELECT
							count(*) as cnt
						FROM
							${DB_PREFIX}newsletter_openings
						WHERE
							newsletter_id = ? AND account_id = ?`;

		inserts = [];
		inserts.push(params.newsletter_id, params.account_id);
		sql = mysql.format(sql, inserts);
		let [rows, fields] = await conn.execute(sql);
		let cnt = rows[0].cnt;

		// IF not already counted as opened
		if (!cnt) {
			sql = `INSERT INTO ${DB_PREFIX}newsletter_openings
							SET
								newsletter_id = ?,
								account_id = ?,
								newsletter_opened_date = NOW()`;

			inserts = [];
			inserts.push(params.newsletter_id, params.account_id);
			sql = mysql.format(sql, inserts);
			await conn.execute(sql);

			sql = `UPDATE ${DB_PREFIX}newsletters
							SET
								newsletter_opened_cnt = newsletter_opened_cnt + 1
							WHERE
								newsletter_id = ?`;

			inserts = [];
			inserts.push(params.newsletter_id);
			sql = mysql.format(sql, inserts);
			await conn.execute(sql);
		}
		// console.log("COMMIT");

		await conn.commit();
		await conn.end();
	} catch (e) {

		// console.log("ROLLBACK");
		await conn.query("ROLLBACK");
		await conn.end();
		return "error in sql";
	}

	return `header('Location: trackingpixel.gif')`;
}

/* addOne */
async function addOne({
	newsletter_recipient_type_id,
	admin_user_id,
	newsletter_subject,
	newsletter_body_text,
	newsletter_body_html,
	newsletter_sent,
	newsletter_send,
	newsletter_send_complete,
	newsletter_send_status,
}) {
	var sql = `INSERT INTO ${DB_PREFIX}newsletters SET
								newsletter_recipient_type_id = ?,
                admin_user_id = ?,
                newsletter_subject = ?,
                newsletter_body_text = ?,
                newsletter_body_html = ?,
                newsletter_sent = ?,
                newsletter_send = ?,
                newsletter_send_complete = ?,
                newsletter_send_status = ?,
                created_dt = NOW(),
                modified_dt= NOW()`;

	var inserts = [];
	inserts.push(
		newsletter_recipient_type_id,
		admin_user_id,
		newsletter_subject,
		newsletter_body_text,
		newsletter_body_html,
		newsletter_sent,
		newsletter_send,
		newsletter_send_complete,
		newsletter_send_status
	);
	newsletter = await doDBQuery(sql, inserts);
	return newsletter;
}

async function editOne({
	id,
	newsletter_recipient_type_id,
	admin_user_id,
	newsletter_subject,
	newsletter_body_text,
	newsletter_body_html,
	newsletter_sent,
	newsletter_send,
	newsletter_send_complete,
	newsletter_send_status,
}) {
	var sql = `UPDATE ${DB_PREFIX}newsletters SET
							newsletter_recipient_type_id = ?,
							admin_user_id = ?,
							newsletter_subject = ?,
							newsletter_body_text = ?,
							newsletter_body_html = ?,
							newsletter_sent = ?,
							newsletter_send = ?,
							newsletter_send_complete = ?,
							newsletter_send_status = ?,
							modified_dt= NOW()
						WHERE newsletter_id = ?`;
	var inserts = [];
	inserts.push(
		newsletter_recipient_type_id,
		admin_user_id,
		newsletter_subject,
		newsletter_body_text,
		newsletter_body_html,
		newsletter_sent,
		newsletter_send,
		newsletter_send_complete,
		newsletter_send_status,
		id
	);
	newsletter = await doDBQuery(sql, inserts);

	return newsletter;
}

async function deleteOne(id) {
	const sql =
		`UPDATE ${DB_PREFIX}newsletters SET deleted=1, deleted_dt= NOW() WHERE newsletter_id = ` +
		id;
	newsletter = await doDBQuery(sql);

	return newsletter;
}

async function changeStatus({ id, status }) {
	const sql =
		`UPDATE ${DB_PREFIX}newsletters SET status = "` +
		status +
		`" WHERE newsletter_id = ` +
		id;
	newsletter = await doDBQuery(sql);

	return newsletter;
}

async function getRecipientTypes() {
	const sql =
		`SELECT * FROM ` + DB_PREFIX + `newsletter_recipient_types WHERE 1`;
	recipienttypes = await doDBQuery(sql);
	return recipienttypes;
}
