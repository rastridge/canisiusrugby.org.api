
const mysql = require('mysql2/promise')
const { DB } = require('config');
const fs = require('fs');
// const activityLog = require('_helpers/activity-log')

module.exports = doDBQuery

async function doDBQuery(sql, inserts) {

	const conn1 = await mysql.createConnection({
		host: DB.DB_HOST,
		user: DB.DB_USER,
		password: DB.DB_PASSWORD,
		database: DB.DB_DATABASE
	})
	if(inserts) {
			sql = mysql.format(sql, inserts)
	}

	// activityLog('do-queery', 'sql=', sql)

	const [rows, fields] = await conn1.execute(sql)
	conn1.close()

	return rows
}
