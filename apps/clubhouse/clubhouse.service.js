const mysql = require('mysql2/promise');
const { DB_PREFIX } = require('config');
const doDBQuery = require('_helpers/do-query')
module.exports = {
    getAll,
    getOne,
    editOne,
    addOne,
    deleteOne,
    changeStatus
}

async function getAll() {

    const sql = `SELECT
                    clubhouse_id,
                    clubhouse_id as id,
                    clubhouse_title,
                    clubhouse_title as title,
                    clubhouse_description,
                    clubhouse_filepath,
                    clubhouse_category,
                    clubhouse_owner,
                    clubhouse_date,
                    status,
                    deleted,
                    created_dt,
                    modified_dt,
                    modified_dt as dt
                FROM
                    ${DB_PREFIX}clubhouse
                WHERE
                    deleted = 0
                    AND
                    status = 1
                ORDER BY
                    modified_dt DESC`

    clubhouses = await doDBQuery(sql)
    return  clubhouses
}


async function getOne(id) {

    const sql = `SELECT
										clubhouse_id,
										clubhouse_id as id,
		                clubhouse_title,
                    clubhouse_description,
                    clubhouse_filepath,
                    clubhouse_category,
                    clubhouse_owner,
                    clubhouse_date,
                    status,
                    deleted,
                    created_dt,
                    modified_dt,
                    modified_dt as dt
                FROM
                    ${DB_PREFIX}clubhouse
                WHERE
                    deleted = 0
                    AND
                    clubhouse_id = ${id}`

    clubhouse = await doDBQuery(sql)

    return clubhouse[0]
}

async function editOne({ clubhouse_title, clubhouse_description, clubhouse_filepath, clubhouse_category, clubhouse_owner, clubhouse_date, id }) {
    var sql = `UPDATE ${DB_PREFIX}clubhouse SET
                        clubhouse_title = ?,
                        clubhouse_description = ?,
                        clubhouse_filepath = ?,
                        clubhouse_category = ?,
                        clubhouse_owner = ?,
                        clubhouse_date = ?,
                    modified_dt= NOW()
                WHERE clubhouse_id = ?`
    var inserts = []
    inserts.push(clubhouse_title, clubhouse_description, clubhouse_filepath, clubhouse_category, clubhouse_owner, clubhouse_date,  id)
    contributions = await doDBQuery(sql, inserts)

    return contributions
}

async function addOne({ clubhouse_title, clubhouse_description, clubhouse_filepath, clubhouse_category, clubhouse_owner, clubhouse_date }) {

    var sql = `INSERT INTO ${DB_PREFIX}clubhouse SET
                    clubhouse_title = ?,
                    clubhouse_description = ?,
                    clubhouse_filepath = ?,
                    clubhouse_category = ?,
                    clubhouse_owner = ?,
                    clubhouse_date = ?,
                    status = 1,
                    deleted = 0,
                    created_dt = NOW(),
                    modified_dt = NOW()`

    var inserts = []
    inserts.push(clubhouse_title, clubhouse_description, clubhouse_filepath, clubhouse_category, clubhouse_owner, clubhouse_date)
    clubhouse = await doDBQuery(sql, inserts)

    return clubhouse
}

async function deleteOne(id) {

    const sql = `UPDATE ${DB_PREFIX}clubhouse SET deleted = 1, deleted_dt= NOW() WHERE clubhouse_id = ` + id
    clubhouse = await doDBQuery(sql)

    return clubhouse
}

async function changeStatus({ id, status }) {
    const sql = `UPDATE ${DB_PREFIX}clubhouse SET status = "` + status + `" WHERE clubhouse_id = ` + id
    clubhouse = await doDBQuery(sql)

    return clubhouse
}
