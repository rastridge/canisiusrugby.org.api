const notifyUser = require('_helpers/notifyUser')
const doDBQuery = require('_helpers/do-query')
const { DB_PREFIX, ORGANIZATION_EMAIL, ORGANIZATION } = require('config')

//const generator = require('generate-password')

module.exports = {
    getAll,
		getAllCurrent,
    getOne,
    addOne,
    editOne,
    deleteOne,
    changeStatus
}

async function getAll() {

    const sql = `SELECT
									ad_client_id,
									ad_client_id as id,
									ad_client_name,
									ad_client_name as title,
									ad_client_contact,
									ad_client_email,
									ad_client_phone,
									ad_client_website,
									ad_image_path,
									status,
									deleted,
									deleted_dt,
									modified_dt,
									modified_dt as dt
                FROM ${DB_PREFIX}sponsors
                WHERE deleted = 0
                ORDER BY title ASC`

    sponsors = await doDBQuery(sql)

    return sponsors
}
async function getAllCurrent() {

    const sql = `SELECT
										ad_client_id,
										ad_client_id as id,
										ad_client_name,
										ad_client_name as title,
										ad_client_contact,
										ad_client_email,
										ad_client_phone,
										ad_client_website,
										ad_image_path,
										status,
										deleted,
										deleted_dt,
										modified_dt,
										modified_dt as dt
									FROM ${DB_PREFIX}sponsors
									WHERE
										deleted = 0
										AND
										STATUS = 1`

    sponsors = await doDBQuery(sql)

    return sponsors
}

async function getOne(id) {

    const sql = `select * from ${DB_PREFIX}sponsors where ad_client_id=${id}`
    sponsor = await doDBQuery(sql)
    return sponsor[0]
}

async function deleteOne(id) {
    const sql = `UPDATE ${DB_PREFIX}sponsors SET deleted=1, deleted_dt=NOW() WHERE ad_client_id=${id}`
    sponsor = await doDBQuery(sql)
    return sponsor
}

async function addOne({
		ad_client_name,
		ad_client_contact,
		ad_client_email,
		ad_client_phone,
		ad_client_website,
		ad_image_path
}) {

    // check for other users with proposed email address
    let sql = `select * from ${DB_PREFIX}sponsors where deleted = 0`
    sponsors = await doDBQuery(sql)
    let sponsor = sponsors.find(u => u.ad_client_email === ad_client_email )

    if (!sponsor) {
        sql = `INSERT INTO ${DB_PREFIX}sponsors
                SET
								ad_client_name = ?,
								ad_client_contact = ?,
								ad_client_email = ?,
								ad_client_phone = ?,
								ad_client_website = ?,
								ad_image_path = ?,

								STATUS = 1,
								deleted = 0,
								created_dt = NOW(),
								modified_dt = NOW()`

        var inserts = []
        inserts.push(
					ad_client_name,
					ad_client_contact,
					ad_client_email,
					ad_client_phone,
					ad_client_website,
					ad_image_path
					)
        sponsor = await doDBQuery(sql, inserts)
        sponsor.error = ''
        const msg = `An ` + ORGANIZATION + ` sponsorship for ${ad_client_name} has been created. Email ${ad_client_email}`
        notifyUser( msg, ORGANIZATION_EMAIL).catch(console.error);
    } else {
        sponsor.error = 'Sponsor with email ${ad_client_email} already exists'
        console.log(sponsor.error)
    }

    return sponsor
}

async function editOne({
		ad_client_name,
		ad_client_contact,
		ad_client_email,
		ad_client_phone,
		ad_client_website,
		ad_image_path,
    id
}) {
    let sql = `SELECT * FROM ${DB_PREFIX}sponsors WHERE deleted = 0 AND ad_client_id <> ${id}`
    sponsors = await doDBQuery(sql)
    let sponsor = sponsors.find( u => u.ad_client_email === ad_client_email )

    if (!sponsor) { // undefined - no other users with proposed email
			let inserts = [];
			sql = `UPDATE ${DB_PREFIX}sponsors SET
							ad_client_name = ?,
							ad_client_contact = ?,
							ad_client_email = ?,
							ad_client_phone = ?,
							ad_client_website = ?,
							ad_image_path = ?,
							modified_dt= NOW()
						WHERE ad_client_id = ?`

			inserts.push(
				ad_client_name,
				ad_client_contact,
				ad_client_email,
				ad_client_phone,
				ad_client_website,
				ad_image_path,
				id
			)
			const msg = `An ` + ORGANIZATION + `sponsorship for ${ad_client_name} has been modified. Email ${ad_client_email}`

			sponsor = await doDBQuery(sql, inserts)
			sponsor.error = ''

			console.log(msg)
			notifyUser( msg, ORGANIZATION_EMAIL).catch(console.error);
		} else {
			sponsor.error = `Sponsor with email ${ad_client_email} already exists`
			console.log(sponsor.error)
    }
    return sponsor
}

async function changeStatus({ id, status }) {
    const sql = `UPDATE ${DB_PREFIX}sponsors SET STATUS = "` + status + `" WHERE ad_client_id  = ` + id
    sponsor = await doDBQuery(sql)
    return sponsor
}
