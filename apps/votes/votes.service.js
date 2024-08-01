const mysql = require('mysql2/promise')
// const sendElasticEmail = require("_helpers/elastic-email");
const sendEmail = require("_helpers/sendEmail")
const doDBQuery = require("_helpers/do-query")
const { FROM, FROM_NAME } = require("email_constants.json")
const { SITE_URL, DB_PREFIX, DB, ORGANIZATION } = require('config')

module.exports = {
	getAll,
	getOne,
	addOne,
	editOne,
	getAllChoices,
	getUsedChoices,
	getQuestions,
	sendBallot,
	registerBallot,
	deleteOne,
	changeStatus,
};

async function getAll() {
	const sql = `SELECT
								vote_id,
								vote_id as id,
								vote_question,
								vote_question as title,
								vote_vote_cnt,
								status,
								deleted,
								deleted_dt,
								created_dt,
								modified_dt,
								modified_dt as dt
					FROM ${DB_PREFIX}votes
					WHERE deleted = 0
					ORDER BY modified_dt DESC`

	votes = await doDBQuery(sql)

	return votes
}

// redsein table field names?
async function getAllChoices(id) {
	const sql = `SELECT *,
									vote_answer as vote_choice,
									vote_answer_cnt as vote_choice_cnt,
									vote_answer_id as vote_choice_id
								FROM ${DB_PREFIX}votes_answers
								WHERE vote_id= ${id}`

	choices = await doDBQuery(sql)
	return choices
}

async function getUsedChoices() {
	const sql = `SELECT *,
									vote_answer as vote_choice,
									vote_answer_cnt as vote_choice_cnt,
									vote_answer_id as vote_choice_id
								FROM ${DB_PREFIX}votes_answers
								WHERE
									vote_answer <> ''`

	choices = await doDBQuery(sql)
	return choices
}

async function getOne(id) {
	const sql = `select * from ${DB_PREFIX}votes where vote_id= ` + id;
	votes = await doDBQuery(sql);
	return votes[0];
}

async function editOne({ vote_question, choices, id }) {

	const conn = await mysql.createConnection({
		host: DB.DB_HOST,
		user: DB.DB_USER,
		password: DB.DB_PASSWORD,
		database: DB.DB_DATABASE
	})

	try {
		await conn.query('START TRANSACTION')

		let sql = `UPDATE ${DB_PREFIX}votes
									SET
										vote_question = ?,
										modified_dt = NOW()
									WHERE vote_id = ?`

		let inserts = [];
		inserts.push(vote_question, id)
		sql = mysql.format(sql, inserts)
		await conn.execute(sql)

		await choices.forEach(e => {
			let sql = `UPDATE ${DB_PREFIX}votes_answers
										SET
											vote_answer = ?,
											vote_answer_cnt = 0
										WHERE
										vote_answer_id = ?`
				let inserts = []
				inserts.push(e.vote_choice, e.vote_choice_id)
				sql = mysql.format(sql, inserts)
				conn.execute(sql)
			})
		await conn.commit()
		await conn.end()
		return 'commit'
	}
	catch(e) {
		await conn.query('ROLLBACK')
		await conn.end()
		return 'rollback'
	}
}

async function addOne({ vote_question, choices }) {

	const conn = await mysql.createConnection({
		host: DB.DB_HOST,
		user: DB.DB_USER,
		password: DB.DB_PASSWORD,
		database: DB.DB_DATABASE
	})

	try {
		await conn.query('START TRANSACTION')

		let sql = `INSERT INTO ${DB_PREFIX}votes
									SET
										vote_question = ?,
										STATUS = 1,
										deleted = 0,
										created_dt = NOW(),
										modified_dt = NOW()`;

		let inserts = [];
		inserts.push(vote_question)
		sql = mysql.format(sql, inserts)
		const [rows, fields] = await conn.execute(sql)
		const id = rows.insertId

		await choices.forEach(e => {
			let sql = `INSERT INTO ${DB_PREFIX}votes_answers
										SET
										vote_answer = ?,
										vote_answer_cnt  = 0,
										vote_id = ?`
				let inserts = []
				inserts.push(e.vote_choice, id)
				sql = mysql.format(sql, inserts)
				conn.execute(sql)
			})
		await conn.commit()
		await conn.end()
		return true
	}
	catch(e) {
		await conn.query('ROLLBACK')
		await conn.end()
		return false
	}
}

async function registerBallot({account_email, answers}) {

	const conn = await mysql.createConnection({
		host: DB.DB_HOST,
		user: DB.DB_USER,
		password: DB.DB_PASSWORD,
		database: DB.DB_DATABASE
	})

	try {
		await conn.query('START TRANSACTION')

		await answers.forEach(a => {
			if(a.vote_answer_id !== '0') {
				let sql = `INSERT INTO ${DB_PREFIX}votes_voted
										SET
											voted_email = ?,
											vote_date = NOW(),
											vote_id = ?`

				let inserts = []
				inserts.push(account_email, a.vote_id)
				sql = mysql.format(sql, inserts)
				conn.execute(sql)

				// increment vote answer count
				sql = `UPDATE ${DB_PREFIX}votes_answers
						SET
							vote_answer_cnt = vote_answer_cnt + 1
						WHERE
							vote_answer_id = ?`

				inserts = [];
				inserts.push(a.vote_answer_id, a.vote_answer_id)
				sql = mysql.format(sql, inserts)
				conn.execute(sql)

				// increment vote count
				sql = `UPDATE ${DB_PREFIX}votes
						SET
							vote_vote_cnt = vote_vote_cnt + 1
						WHERE
							vote_id = ?`

				inserts = []
				inserts.push(a.vote_id )
				sql = mysql.format(sql, inserts)
				conn.execute(sql)
			}
		})
		await conn.commit()
		await conn.end()
		console.log('commit')
		return 'commit'
	}
	catch(e) {
		await conn.query('ROLLBACK')
		await conn.end()
		console.log('rollback')
		return 'commit'
	}
}

async function sendBallot({ email }) {

	const textBody = ORGANIZATION + '\r\n Go here to vote:\r\n\r\n'
	+ `<a href="${SITE_URL}/admin/votes/form?account_email=` + email
	+ ' \r\n'
	+ 'Heads up: There may be more than one available question on which to vote. If so, the next question will come up when the current one is submitted.\r\n'
	+ ' \r\n'
	+ 'Your vote is final once you hit Submit.\r\n'

	const htmlBody = '<h3>Heads up: <br>There may be more than one available question on which to vote. If so, the next question will come up when the current one is submitted.'
	+ '<br>'
	+ '<br>'
	+ 'Your vote is final once you hit Submit'
	+ '<br>'
	+ '<br>'
	+ `<a href="${SITE_URL}/admin/votes/form?account_email=` + email
	+ '">Start Voting Here</></h3>'

	const sendTo = {
			'from': FROM,
			'fromName': FROM_NAME,
			'to': email,
			'subject': 'Vote',
			'body_html': htmlBody,
			'body_text': textBody
	}

	const result = sendEmail(sendTo)
}

async function getQuestions(account_email) {
	let sql = `SELECT
								v.vote_id,
								v.vote_question
							FROM
								${DB_PREFIX}votes v
							WHERE
								v.deleted = 0 AND
								v.STATUS = 1 AND
							NOT EXISTS(
								SELECT
										*
								FROM
									${DB_PREFIX}votes_voted vv
								WHERE
										vv.voted_email = '${account_email}'
								AND
									vv.vote_id = v.vote_id
							)`

	votes = await doDBQuery(sql)
	return votes
}

async function deleteOne(id) {
	const sql =
		`UPDATE ${DB_PREFIX}votes SET deleted=1, deleted_dt= NOW() WHERE vote_id=` + id
	votes = await doDBQuery(sql)
	return votes
}

async function changeStatus({ id, status }) {
	const sql =
		`UPDATE ${DB_PREFIX}votes SET STATUS = "` + status + `" WHERE vote_id = ` + id
	account = await doDBQuery(sql)
	return account
}
