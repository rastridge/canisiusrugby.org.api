const mysql = require('mysql2/promise')
const { DB_PREFIX } = require('config')
const doDBQuery = require('_helpers/do-query')

module.exports = {
		getAll,
		getCurrent,
		getOne,
    editOne,
    addOne,
    deleteOne,
    changeStatus
}

async function getAll() {

    const sql = `SELECT
									supportingApp_id,
									supportingApp_id as id,
									supportingApp_name,
									supportingApp_name as title,
									supportingApp_description,
									supportingApp_url,
									supportingApp_owner,
									supportingApp_username,
									supportingApp_password,
									status,
									deleted,
									deleted_dt,
									created_dt,
									modified_dt,
									modified_dt as dt
                FROM
									${DB_PREFIX}supportingaccts
                WHERE
									deleted = 0
                ORDER BY
									id ASC`

    supportingAppss = await doDBQuery(sql)
    return  supportingAppss
}

async function getCurrent() {

	const sql = `SELECT
								supportingApp_id,
								supportingApp_id as id,
								supportingApp_name,
								supportingApp_name as title,
								supportingApp_description,
								supportingApp_url,
								supportingApp_owner,
								supportingApp_username,
								supportingApp_password,
								status,
								deleted,
								deleted_dt,
								created_dt,
								modified_dt,
								modified_dt as dt
							FROM
								${DB_PREFIX}supportingaccts
							WHERE
								deleted = 0
								AND
								status = 1
							ORDER BY
								id ASC`

	supportingAppss = await doDBQuery(sql)
	return  supportingAppss
}

async function getOne(id) {

    const sql = `SELECT
									supportingApp_id,
									supportingApp_id as id,
									supportingApp_name,
									supportingApp_name as title,
									supportingApp_description,
									supportingApp_url,
									supportingApp_owner,
									supportingApp_username,
									supportingApp_password
                FROM
                  ${DB_PREFIX}supportingaccts
                WHERE
									deleted = 0
									AND
									supportingApp_id = ${id}`

    supportingApps = await doDBQuery(sql)

    return supportingApps[0]
}

async function editOne({
		supportingApp_name,
		supportingApp_description,
		supportingApp_url,
		supportingApp_owner,
		supportingApp_username,
		supportingApp_password,
		id
		})
{
    const sql = `UPDATE ${DB_PREFIX}supportingaccts SET
									supportingApp_name = ?,
									supportingApp_description = ?,
									supportingApp_url = ?,
									supportingApp_owner = ?,
									supportingApp_username = ?,
									supportingApp_password = ?,
									modified_dt= NOW()
                WHERE supportingApp_id = ?`
    const inserts = []
    inserts.push(
			supportingApp_name,
			supportingApp_description,
			supportingApp_url,
			supportingApp_owner,
			supportingApp_username,
			supportingApp_password,
			id
		)
    supportingApps = await doDBQuery(sql, inserts)
    return supportingApps
}

async function addOne({
	supportingApp_name,
	supportingApp_description,
	supportingApp_url,
	supportingApp_owner,
	supportingApp_username,
	supportingApp_password
})
{
		const sql = `INSERT INTO ${DB_PREFIX}supportingaccts
									SET
									supportingApp_name = ?,
									supportingApp_description = ?,
									supportingApp_url = ?,
									supportingApp_owner = ?,
									supportingApp_username = ?,
									supportingApp_password = ?,
									status = 1,
									deleted = 0,
									created_dt = NOW(),
									modified_dt = NOW()`
    var inserts = []
    inserts.push(
			supportingApp_name,
			supportingApp_description,
			supportingApp_url,
			supportingApp_owner,
			supportingApp_username,
			supportingApp_password
				)
    supportingApps = await doDBQuery(sql, inserts)
    return supportingApps
}

async function deleteOne(id) {

    const sql = `UPDATE ${DB_PREFIX}supportingaccts SET deleted = 1, deleted_dt= NOW() WHERE supportingApp_id = ` + id
    supportingApps = await doDBQuery(sql)
    return supportingApps
}

async function changeStatus({ id, status }) {
    const sql = `UPDATE ${DB_PREFIX}supportingaccts SET status = "` + status + `" WHERE supportingApp_id = ` + id
    supportingApps = await doDBQuery(sql)
    return supportingApps
}
