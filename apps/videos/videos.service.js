const mysql = require('mysql2/promise')
const { DB_PREFIX } = require('config')
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
                    video_id,
                    video_id as id,
                    video_title,
                    video_title as title,
                    video_synop,
                    video_url,
                    video_release_dt,
                    video_event_dt,
                    video_expire_dt,
                    status,
                    deleted,
                    created_dt,
                    modified_dt,
                    modified_dt as dt
                FROM
                    ${DB_PREFIX}video
                WHERE
                    deleted = 0
                    AND
                    status = 1
                ORDER BY
                    video_event_dt DESC`

    videos = await doDBQuery(sql)
    return  videos
}

async function getOne(id) {

    const sql = `SELECT
                    video_title,
                    video_synop,
                    video_url,
                    video_release_dt,
                    video_event_dt,
                    video_expire_dt,
                    status,
                    deleted,
                    created_dt,
                    modified_dt
                 FROM
                    ${DB_PREFIX}video
                WHERE
                    deleted = 0
                    AND
                    video_id = ${id}`

    video = await doDBQuery(sql)
    return video[0]
}

async function editOne({
                    video_title,
                    video_synop,
                    video_url,
                    video_release_dt,
                    video_event_dt,
                    video_expire_dt,
                    id
                })
{
    const sql = `UPDATE ${DB_PREFIX}video SET
                video_title = ?,
                video_synop = ?,
                video_url = ?,
                video_release_dt = ?,
                video_event_dt = ?,
                video_expire_dt = ?,
                modified_dt = NOW()
            WHERE video_id = ?`
    var inserts = []
    inserts.push(
            video_title,
            video_synop,
            video_url,
            video_release_dt,
            video_event_dt,
            video_expire_dt,
            id
        )
    video = await doDBQuery(sql, inserts)

    return video
}

async function addOne({
                    video_title,
                    video_synop,
                    video_url,
                    video_release_dt,
                    video_event_dt,
                    video_expire_dt
                })
{
    const sql = `INSERT INTO ${DB_PREFIX}video SET
                    video_title = ?,
                    video_synop = ?,
                    video_url = ?,
                    video_release_dt = ?,
                    video_event_dt = ?,
                    video_expire_dt = ?,
                    status = 1,
                    deleted = 0,
                    created_dt = NOW(),
                    modified_dt = NOW()`

    var inserts = []
    inserts.push(
        video_title,
        video_synop,
        video_url,
        video_release_dt,
        video_event_dt,
        video_expire_dt
)
    video = await doDBQuery(sql, inserts)
    return video
}

async function deleteOne(id) {

    const sql = `UPDATE ${DB_PREFIX}video SET deleted = 1, deleted_dt= NOW() WHERE video_id = ` + id
    video = await doDBQuery(sql)
    return video
}

async function changeStatus({ id, status }) {
    const sql = `UPDATE ${DB_PREFIX}video SET status = "` + status + `" WHERE video_id = ` + id
    video = await doDBQuery(sql)
    return video
}
