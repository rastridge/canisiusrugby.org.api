const mysql = require("mysql2/promise");
const { DB_PREFIX } = require("config");
const doDBQuery = require("_helpers/do-query");

module.exports = {
	getAll,
	getOne,
	editOne,
	addOne,
	deleteOne,
	changeStatus,
};

async function getAll() {
	const sql = `SELECT
					archive_id,
					archive_id as id,
					archive_title,
					archive_title as title,
					CONCAT(DATE_FORMAT(archive_date,"%Y %b")," - ", archive_title, " - ", archive_description) as title2,
					archive_description,
					archive_filepath,
					archive_date,
					status,
					deleted,
					created_dt,
					modified_dt,
					modified_dt as dt
			FROM
					${DB_PREFIX}archive
			WHERE
					deleted = 0
					AND
					status = 1
			ORDER BY
					archive_date ASC`;
	archives = await doDBQuery(sql);
	return archives;
}

async function getOne(id) {
	const sql = `SELECT
                    archive_id,
                    archive_title,
                    archive_title as title,
                    archive_description,
                    archive_filepath,
                    archive_date,
                    status,
                    deleted,
                    created_dt,
                    modified_dt
                FROM
                    ${DB_PREFIX}archive
                WHERE
                    deleted = 0
                    AND
                    archive_id = ${id}`;

	contributions = await doDBQuery(sql);

	return contributions[0];
}

async function editOne({
	archive_title,
	archive_description,
	archive_filepath,
	archive_date,
	id,
}) {
	const sql = `UPDATE ${DB_PREFIX}archive SET
                    archive_title = ?,
                    archive_description = ?,
                    archive_filepath = ?,
                    archive_date = ?,
                    modified_dt= NOW()
                WHERE archive_id = ?`;
	const inserts = [];
	inserts.push(
		archive_title,
		archive_description,
		archive_filepath,
		archive_date,
		id
	);
	contributions = await doDBQuery(sql, inserts);

	return contributions;
}

async function addOne({
	archive_title,
	archive_description,
	archive_filepath,
	archive_date,
}) {
	const sql = `INSERT INTO ${DB_PREFIX}archive SET
                    archive_title = ?,
                    archive_description = ?,
                    archive_filepath = ?,
                    archive_date = ?,
                    status = 1,
                    deleted = 0,
                    created_dt = NOW(),
                    modified_dt = NOW()`;
	var inserts = [];
	inserts.push(
		archive_title,
		archive_description,
		archive_filepath,
		archive_date
	);
	archive = await doDBQuery(sql, inserts);

	return archive;
}

async function deleteOne(id) {
	const sql =
		`UPDATE ${DB_PREFIX}archive SET deleted = 1, deleted_dt= NOW() WHERE archive_id = ` +
		id;
	archive = await doDBQuery(sql);

	return archive;
}

async function changeStatus({ id, status }) {
	const sql =
		`UPDATE ${DB_PREFIX}archive SET status = "` +
		status +
		`" WHERE archive_id = ` +
		id;
	archive = await doDBQuery(sql);

	return archive;
}
