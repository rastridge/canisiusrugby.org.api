const mysql = require('mysql2/promise');
const { DB_PREFIX } = require('config');
const doDBQuery = require('_helpers/do-query')
const activityLog = require('_helpers/activity-log')

module.exports = {
    getAll,
    // getAllCurrent,
    getTopContributors,
    getPrevious,
    getTotal,
    getYear,
    getOne,
    addOne,
    editOne,
    deleteOne,
    changeStatus
}
async function getAll() {

	const sql = `SELECT
								c.contribution_id,
								c.contribution_id as id,
								CONCAT(a.member_firstname,' ',a.member_lastname  ) as title,
								c.contribution_date as dt,
								c.status
							FROM
								${DB_PREFIX}accounts a,
								${DB_PREFIX}contributions c
							WHERE
								c.deleted = 0
								AND a.account_id = c.account_id
							ORDER BY dt DESC`


	contributions = await doDBQuery(sql)

	return  contributions
}
/*
async function getAllCurrent() {

    const sql = `SELECT
									contribution_id,
									contribution_id as id,
									title,
									event_dt as dt,
									expire_dt,
									status,
									synop,
									article
                FROM
                    ${DB_PREFIX}contributions
                WHERE
									deleted = 0
									AND
									status = 1
									AND
									DATEDIFF( CURDATE(), expire_dt)  <=  0

                ORDER BY dt DESC`

    contributions = await doDBQuery(sql)
    return  contributions
}
*/
async function getTopContributors() {

	const sql = `SELECT
					CONCAT(a.member_firstname,' ', a.member_lastname ) as Name,
					sum(contribution_amount) as Total
				FROM
					${DB_PREFIX}contributions c,
					${DB_PREFIX}accounts a
				WHERE
					(c.account_id = a.account_id)
					AND c.deleted = 0
					AND c.Status = 1
					AND c.contribution_showAmount = 1
				GROUP BY
					Name
				ORDER BY
					Total DESC
				LIMIT 0, 20`

				// activityLog('contributions', 'in getTop', sql)

		contributions = await doDBQuery(sql)
		return  contributions
}

async function getPrevious(id) {

	const sql = `SELECT
								c.contribution_id,
								CONCAT(a.member_lastname,', ', a.member_firstname ) as name,
								c.contribution_date as dt,
								c.contribution_amount
							FROM
								${DB_PREFIX}accounts a,
								${DB_PREFIX}contributions c
							WHERE
								c.deleted = 0
								AND a.account_id = c.account_id
								AND a.account_id = ${id}
							ORDER BY dt DESC`
    contributions = await doDBQuery(sql)
    return  contributions
}

async function getTotal(year) {

	sql = `SELECT
						sum(contribution_amount) as Total
					FROM
						${DB_PREFIX}contributions
					WHERE
						deleted = 0
						AND Status = 1
						AND YEAR(contribution_date) = ${year}`

						// activityLog('contributions', 'in getTotal', sql)

	total = await doDBQuery(sql)
	return  total[0]
}

async function getYear(year) {

	sql = `SELECT
					c.contribution_id,
					c.contribution_id as id,
					contribution_amount,
					contribution_showName,
					contribution_showAmount,
					contribution_comment,
					contribution_date,
					contribution_date as dt,
					a.member_firstname,
					a.member_lastname,
					CONCAT(a.member_firstname,' ', a.member_lastname ) as title,
					a.member_year as year_joined,
					c.Status,
					c.Status as status,
					c.deleted,
					c.deleted_dt,
					c.created_dt,
					c.modified_dt
				FROM
					${DB_PREFIX}accounts a,
					${DB_PREFIX}contributions c
				WHERE
					c.deleted = 0
					AND c.Status = 1
					AND a.account_id = c.account_id
					AND YEAR(contribution_date) = ${year}
				ORDER BY
					contribution_date DESC`

					// activityLog('contributions', 'in getYear', sql)

	contributions = await doDBQuery(sql)
	return  contributions
}

async function getOne(id) {

    const sql = `SELECT
									CONCAT(a.member_firstname,' ', a.member_lastname  ) as contribution_name,
									c.contribution_date,
									c.contribution_amount,
									c.contribution_showName,
									c.contribution_showAmount,
									c.contribution_comment
                FROM
				    			${DB_PREFIX}accounts a,
                  ${DB_PREFIX}contributions c
                WHERE
									c.deleted = 0
									AND a.account_id = c.account_id
									AND c.contribution_id = ${id}`

    contributions = await doDBQuery(sql)
    return contributions[0]
}

async function editOne({ contribution_date, contribution_amount, contribution_showName, contribution_showAmount, contribution_comment, id }) {
	const sql = `UPDATE ${DB_PREFIX}contributions SET
								contribution_date = ?,
								contribution_amount = ?,
								contribution_showName = ?,
								contribution_showAmount = ?,
								contribution_comment = ?,
								modified_dt= NOW()
							WHERE contribution_id = ?`

	let inserts = []
	inserts.push(contribution_date, contribution_amount, contribution_showName, contribution_showAmount, contribution_comment, id )
	contributions = await doDBQuery(sql, inserts)
	return contributions
}

async function addOne({ account_id, contribution_date, contribution_amount, contribution_showName, contribution_showAmount, contribution_comment }) {

	const sql = `INSERT INTO ${DB_PREFIX}contributions SET
		account_id = ?,
		contribution_date = ?,
		contribution_amount = ?,
		contribution_showName = ?,
		contribution_showAmount = ?,
		contribution_comment = ?,
		created_dt = NOW(),
		modified_dt= NOW()`

	let inserts = []
	inserts.push(account_id, contribution_date, contribution_amount, contribution_showName, contribution_showAmount, contribution_comment)
	contributions = await doDBQuery(sql, inserts)
	return contributions
}

async function deleteOne(id) {

    const sql = `UPDATE ${DB_PREFIX}contributions SET deleted = 1, deleted_dt= NOW() WHERE contribution_id = ${id}`
    contributions = await doDBQuery(sql)

    return contributions
}

async function changeStatus({ id, status }) {
    const sql = `UPDATE ${DB_PREFIX}contributions SET status = "` + status + `" WHERE contribution_id = ${id}`
    contributions = await doDBQuery(sql)

    return contributions
}
