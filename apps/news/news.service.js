const mysql = require('mysql2/promise');
const { DB_PREFIX } = require('config');
const doDBQuery = require('_helpers/do-query')
const fs = require('fs')
module.exports = {
    getAll,
    getAllCurrent,
    getNewsLetterRecipientTypes,
    getOne,
    addOne,
    editOne,
    deleteOne,
    changeStatus
}
async function getAll() {

    const sql = `SELECT
									news_id,
									news_id as id,
									news_title,
									news_title as title,
									news_event_dt,
									news_event_dt as dt,
									news_expire_dt,
									news_synop,
									status
                FROM
									${DB_PREFIX}news
                WHERE
									deleted = 0
                ORDER BY dt DESC`

    news = await doDBQuery(sql)

    return  news
}

async function getAllCurrent() {

    const sql = `SELECT
										news_id,
										news_id as id,
										news_title,
										news_title as title,
                    news_event_dt,
                    news_event_dt as dt,
                    news_expire_dt,
                    status,
                    news_synop,
                    news_article
                FROM
                    ${DB_PREFIX}news
                WHERE
                    deleted = 0
                    AND
                    status = 1
                    AND
                    DATEDIFF( CURDATE(), news_expire_dt)  <=  0

                ORDER BY dt DESC`

    news = await doDBQuery(sql)
    return  news
}


async function getOne(id) {

    const sql = `select * from ${DB_PREFIX}news where news_id = ` + id

    news = await doDBQuery(sql)

    return news[0]
}


async function addOne({ news_title, news_synop, news_article, news_event_dt, news_release_dt, news_expire_dt }) {

    var sql = `INSERT INTO ${DB_PREFIX}news SET
								news_title = ?,
								news_synop = ?,
								news_article = ?,
								news_event_dt = ?,
								news_release_dt = ?,
								news_expire_dt = ?,
								created_dt = NOW(),
								modified_dt= NOW()`

    var inserts = []
    inserts.push(news_title, news_synop, news_article, news_event_dt, news_release_dt, news_expire_dt)
    news = await doDBQuery(sql, inserts)

    return news

}

async function deleteOne(id) {

    const sql = `UPDATE ${DB_PREFIX}news SET deleted=1, deleted_dt= NOW() WHERE news_id = ` + id
    news = await doDBQuery(sql)

    return news
}

async function changeStatus({ id, status }) {
    const sql = `UPDATE ${DB_PREFIX}news SET status = "` + status + `" WHERE news_id = ` + id
    news = await doDBQuery(sql)

    return news
}

async function editOne({ id, news_title, news_synop, news_article, news_event_dt, news_release_dt, news_expire_dt }) {
    var sql = `UPDATE ${DB_PREFIX}news SET
								news_title = ?,
								news_synop = ?,
								news_article = ?,
								news_event_dt = ?,
								news_release_dt = ?,
								news_expire_dt = ?,
								modified_dt= NOW()
							WHERE news_id = ?`
    var inserts = []
    inserts.push(news_title, news_synop, news_article, news_event_dt, news_release_dt, news_expire_dt, id )
    news = await doDBQuery(sql, inserts)

    return news
}

async function getNewsLetterRecipientTypes() {
    const sql = `SELECT * FROM ${DB_PREFIX}newsletter_recipient_types WHERE 1`
    recipientypes = await doDBQuery(sql)
    return recipientypes
}
