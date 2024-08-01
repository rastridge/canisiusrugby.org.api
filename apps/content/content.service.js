const mysql = require('mysql2/promise');
const { DB_PREFIX } = require('config');
const doDBQuery = require('_helpers/do-query')

module.exports = {
    getAll,
    getCustomMenuItems,
    getOne,
    editOne,
    addOne,
    deleteOne,
    changeStatus
}

async function getAll() {

    const sql = `SELECT
										content_id,
										content_id as id,
										content_name,
                    content_name as title,
                    content_body,
                    content_order,
                    content_release_dt,
                    content_expire_dt,
                    status,
                    deleted,
                    created_dt,
                    modified_dt,
                    modified_dt as dt
                FROM
                    ${DB_PREFIX}content
                WHERE
                    deleted = 0
                    AND
                    status = 1
                ORDER BY
									dt DESC`

    contents = await doDBQuery(sql)
    return  contents
}

async function getCustomMenuItems() {

    const sql = `SELECT
										content_id,
										content_id as id,
										content_name,
                    content_name as title,
                    content_body,
                    content_order,
                    content_release_dt,
                    content_expire_dt,
                    status,
                    deleted,
                    created_dt,
                    modified_dt,
                    modified_dt as dt
                FROM
                    ${DB_PREFIX}content
                WHERE
                    deleted = 0
                    AND
                    status = 1
                    AND
                    content_order != 0
                ORDER BY
                    content_order ASC`

    contents = await doDBQuery(sql)
    return  contents
}

async function getOne(id) {

    const sql = `SELECT
										content_id,
										content_id as id,
										content_name,
                    content_body,
                    content_order,
                    content_release_dt,
                    content_expire_dt,
                    status,
                    deleted,
                    created_dt,
                    modified_dt
                FROM
                    ${DB_PREFIX}content
                WHERE
                    deleted = 0
                    AND
                    content_id = ${id}`

    content = await doDBQuery(sql)

    return content[0]
}

async function editOne({
		content_name,
		content_body,
		content_order,
		content_release_dt,
		content_expire_dt,
		id
	}) {
    let sql = `UPDATE ${DB_PREFIX}content SET
								content_name = ?,
								content_body = ?,
								content_order = ?,
								content_release_dt = ?,
								content_expire_dt = ?,
								modified_dt= NOW()
							WHERE content_id = ?`

    let inserts = []
    inserts.push(
			content_name,
			content_body,
			content_order,
			content_release_dt,
			content_expire_dt,
			id
		)
		console.log('inserts', inserts)
    content = await doDBQuery(sql, inserts)

    return content
}

async function addOne({
	content_name,
	content_body,
	content_order,
	content_release_dt,
	content_expire_dt
}) {

	let sql = `INSERT INTO ${DB_PREFIX}content SET
							content_name = ?,
							content_body = ?,
							content_order = ?,
							content_release_dt = ?,
							content_expire_dt = ?,
							status = 1,
							deleted = 0,
							created_dt = NOW(),
							modified_dt = NOW()`

    let inserts = []
    inserts.push(
			content_name,
			content_body,
			content_order,
			content_release_dt,
			content_expire_dt
		)
		console.log('inserts', inserts)
    content = await doDBQuery(sql, inserts)

    return content
}

async function deleteOne(id) {

    const sql = `UPDATE ${DB_PREFIX}content SET deleted = 1, deleted_dt= NOW() WHERE content_id = ` + id
    content = await doDBQuery(sql)

    return content
}

async function changeStatus({ id, status }) {
    const sql = `UPDATE ${DB_PREFIX}content SET status = "` + status + `" WHERE content_id = ` + id
    content = await doDBQuery(sql)

    return content
}
