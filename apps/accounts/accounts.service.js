const md5 = require('md5')
const fs = require('fs');
const notifyUser = require('_helpers/notifyUser')
const doDBQuery = require('_helpers/do-query')
const activityLog = require('_helpers/activity-log')
const { DB_PREFIX, ORGANIZATION, ORGANIZATION_EMAIL } = require('config');

//const generator = require('generate-password')

module.exports = {
		getAll,
		getType,
		getAllPublic,
		getOfficers,
		getRecentUpdates,
    getWof,
    getOne,
		addOne,
		editOne,
		editByMember,
		lookupByEmail,
    getMemberTypes,
    getMemberAdminTypes,
		getNewsLetterRecipientTypes,
    deleteOne,
    changeStatus
}

async function getAll() {

    const sql = `SELECT
										account_id as id,
										account_id,
										member_type_id,
										member_type2_id,
                    member_firstname,
                    member_lastname,
                    CONCAT(member_firstname," ", member_lastname) as title,
										member_prev_club,
										member_year,
										member_position,
										account_email,
										account_email_opening,
										account_textmsg_opening,
										account_addr_street,
										account_addr_street_ext,
										account_addr_city,
										account_addr_state,
										account_addr_country,
										account_addr_postal,
										account_addr_phone,
                    newsletter_recipient,
										mail_recipient,
                    sms_recipient,
                    modified_dt,
                    modified_dt as dt,
                    status
                FROM ${DB_PREFIX}accounts
                WHERE deleted = 0
                ORDER BY member_lastname ASC`
    accounts = await doDBQuery(sql)

    return accounts
}

async function getAllPublic() {

    const sql = `SELECT
									account_id as id,
									account_id,
									CONCAT(member_firstname," ", member_lastname) as title,
									member_lastname,
									account_email,
									account_addr_city,
									account_addr_state,
									modified_dt
                FROM ${DB_PREFIX}accounts
                WHERE
                    deleted = 0 AND STATUS = 1 ORDER BY member_lastname ASC`

    accounts = await doDBQuery(sql)

    return accounts
}

async function lookupByEmail(email) {

	const sql = `SELECT
								account_id as id,
								account_id,
								member_type_id,
								member_type2_id,
								member_firstname,
								member_lastname,
								CONCAT(member_firstname," ", member_lastname) as name,
								member_position,
								member_prev_club,
								member_year,
								account_email,
								account_email_opening,
								modified_dt
							FROM
								${DB_PREFIX}accounts
							WHERE
								deleted = 0
								AND
								account_email LIKE '${email}'`

	// filename messsage, variable
	// activityLog('lookupByEmail', 'sql=', sql)

	accounts = await doDBQuery(sql)

	return accounts[0]
}

async function getType(id) {

    const sql = `SELECT
									account_id as id,
									account_id,
									member_type_id,
									member_type2_id,
									member_firstname,
									member_lastname,
									CONCAT(member_firstname," ", member_lastname) as title,
									member_position,
									member_prev_club,
									member_year,
									account_email,
									account_email_opening,
									account_textmsg_opening,
									account_addr_street,
									account_addr_street_ext,
									account_addr_city,
									account_addr_state,
									account_addr_country,
									account_addr_postal,
									account_addr_phone,
									newsletter_recipient,
									mail_recipient,
									sms_recipient,
									modified_dt,
									modified_dt as dt,
									status
                FROM
									${DB_PREFIX}accounts
                WHERE
                    deleted = 0 AND member_type_id = ` + id + `
                ORDER BY member_lastname ASC`

    accounts = await doDBQuery(sql)

    return accounts
}

async function getOfficers() {

	const sql = `SELECT
				a.account_id,
				account_id as id,
				account_email,
				CONCAT(member_firstname," ", member_lastname) as title,
				account_addr_phone as phone,
				g.member_admin_type as office,
				h.member_admin_type as office2
			FROM
				${DB_PREFIX}accounts a,
 				${DB_PREFIX}member_admin_types h,
				${DB_PREFIX}member_admin_types g
			WHERE
				a.member_admin_type_id = g.member_admin_type_id
				AND a.member_admin_type2_id = h.member_admin_type_id
				AND ((a.member_admin_type_id > 0) OR (a.member_admin_type2_id > 0 ))
				AND a.deleted = 0
				AND a.STATUS = 1
			ORDER BY
				a.member_admin_type_id`

	officers = await doDBQuery(sql)

	return officers
}

async function getRecentUpdates() {

	const sql = `SELECT
								account_id,
								CONCAT(member_firstname," ", member_lastname) as name,
								modified_dt
							FROM
								${DB_PREFIX}accounts
							WHERE
								deleted = 0
								AND STATUS = 1
							ORDER BY
								modified_dt DESC
							LIMIT 20`

	recent = await doDBQuery(sql)

	return recent
}

async function getWof() {

    const sql = `SELECT
									account_id as id,
									account_id,
									CONCAT(member_firstname," ",member_lastname) AS name,
									member_wall_of_fame_year,
									member_pic_path
                FROM
                    ${DB_PREFIX}accounts
                WHERE
                    member_wall_of_fame_year != ''
                    AND deleted = 0
                    AND Status = 1
                ORDER BY member_wall_of_fame_year`

	accounts = await doDBQuery(sql)
	return accounts
}

async function getOne(id) {
	// filename messsage, variable
	// activityLog('getOne', 'id=', id)
    const sql = `select * from ${DB_PREFIX}accounts where account_id = ` + id
    account = await doDBQuery(sql)
    return account[0]
}

async function deleteOne(id) {
    const sql = `UPDATE ${DB_PREFIX}accounts SET deleted=1, deleted_dt= NOW() WHERE account_id=` + id
    account = await doDBQuery(sql)
    return account
}

async function addOne({
    account_email,
    account_remind,
    member_firstname,
    member_lastname,
    member_nickname,

    member_position,
    member_prev_club,
    member_year,
    account_addr_street,
    account_addr_street_ext,

    account_addr_city,
    account_addr_state,
    account_addr_country,
    account_addr_postal,
    account_addr_phone,

    member_show_addr,
    member_show_phone,
    newsletter_recipient,
		mail_recipient,
    sms_recipient,
    member_pic_path,

    member_wall_of_fame_year,
    member_type_id,
    member_admin_type_id,
    member_admin_type2_id
}) {

    // check for other users with proposed email address
		let sql = `select * from ${DB_PREFIX}accounts where deleted = 0`
		// activityLog('accounts_service', 'in addOne 1 sql=', sql)

    accounts = await doDBQuery(sql)
    let account = accounts.find(u => u.account_email === account_email )
    if (!account) {
        let hashedpassword = md5(account_remind).substring(3,11)
        sql = `INSERT INTO ${DB_PREFIX}accounts
                SET
                    account_email = ?,
                    account_pass = ?,
                    member_firstname = ?,
                    member_lastname = ?,
                    member_nickname = ?,

                    member_position = ?,
                    member_prev_club = ?,
                    member_year = ?,
                    account_addr_street = ?,
                    account_addr_street_ext = ?,

                    account_addr_city = ?,
                    account_addr_state = ?,
                    account_addr_country = ?,
                    account_addr_postal = ?,
                    account_addr_phone = ?,

                    member_show_phone = ?,
                    member_show_addr = ?,
                    newsletter_recipient = ?,
										mail_recipient = ?,
                    sms_recipient = ?,
                    member_pic_path = ?,

                    member_wall_of_fame_year = ?,
                    member_type_id = ?,
                    member_admin_type_id = ?,
                    member_admin_type2_id = ?,

                    STATUS = 1,
                    deleted = 0,
                    created_dt = NOW(),
                    modified_dt = NOW()`
        let inserts = []
        inserts.push(
                account_email,
                hashedpassword,
                member_firstname,
                member_lastname,
                member_nickname,

                member_position,
                member_prev_club,
                member_year,
                account_addr_street,
                account_addr_street_ext,

                account_addr_city,
                account_addr_state,
                account_addr_country,
                account_addr_postal,
                account_addr_phone,

                member_show_phone,
                member_show_addr,
                newsletter_recipient,
                mail_recipient,
                sms_recipient,
                member_pic_path,

                member_wall_of_fame_year,
                member_type_id,
                member_admin_type_id,
                member_admin_type2_id
        )
				account = await doDBQuery(sql, inserts)
				// activityLog('accounts_service', 'in addOne 2 sql=', sql)

        account.error = ''
        const msg = 'An '+ ORGANIZATION + ' member account for ' + member_firstname+ ' ' + member_lastname + '  has been created. Password = '+ account_remind +' email = '+ account_email
				notifyUser( msg, account_email).catch(console.error);
    } else {
        account.error = 'Account with email '+ account_email + ' already exists'
        console.log(account.error)
    }

    return account
}

async function editOne({
		account_email,
		account_remind,
		member_firstname,
		member_lastname,
		member_year,
		member_nickname,
		member_position,
		member_prev_club,
		account_addr_street,
		account_addr_street_ext,
		account_addr_city,
		account_addr_state,
		account_addr_country,
		account_addr_postal,
		account_addr_phone,
		member_show_addr,
		member_show_phone,
		newsletter_recipient,
		mail_recipient,
    sms_recipient,
    member_pic_path,
    member_wall_of_fame_year,

		member_type_id,
		member_type2_id,
		member_admin_type_id,
		member_admin_type2_id,

    id
}) {
//activityLog('editOne', 'editOne 1', id)
    let sql = `SELECT * FROM ${DB_PREFIX}accounts WHERE deleted = 0 AND account_id <> ${id}`
//activityLog('editOne', 'editOne 2', sql)
    accounts = await doDBQuery(sql)
    let account = accounts.find( u => u.account_email === account_email )
//activityLog('editOne', 'editOne 3', account)

    if (!account) { // undefined - no other users with proposed email
			let inserts = [];
        let msg = '';
        if(account_remind === '') { // do not reset password
//activityLog('editOne', 'editOne 4', account_remind)
            sql = `UPDATE ${DB_PREFIX}accounts SET
											account_email = ?,
											member_firstname = ?,
											member_lastname =  ?,
											member_year =  ?,
											member_nickname =  ?,
											member_position =  ?,
											member_prev_club =  ?,
											account_addr_street = ?,
											account_addr_street_ext = ?,
											account_addr_city = ?,
											account_addr_state = ?,
											account_addr_country = ?,
											account_addr_postal = ?,
											account_addr_phone = ?,
											member_show_addr = ?,
											member_show_phone = ?,
											newsletter_recipient = ?,
											mail_recipient = ?,
											sms_recipient = ?,
											member_pic_path = ?,
											member_wall_of_fame_year = ?,

											member_type_id = ?,
											member_type2_id = ?,
											member_admin_type_id  = ?,
											member_admin_type2_id  = ?,
											modified_dt= NOW()
                    WHERE account_id = ?`
//activityLog('editOne', 'editOne 5', sql)

            inserts.push(
                account_email,
                member_firstname,
                member_lastname,
                member_year,
                member_nickname,
                member_position,
                member_prev_club,
                account_addr_street,
                account_addr_street_ext,
                account_addr_city,
                account_addr_state,
                account_addr_country,
                account_addr_postal,
                account_addr_phone,
                member_show_addr,
                member_show_phone,
                newsletter_recipient,
                mail_recipient,
                sms_recipient,
                member_pic_path,
                member_wall_of_fame_year,

                member_type_id,
                member_type2_id,
                member_admin_type_id,
                member_admin_type2_id,
                id
            )
// activityLog('editOne', 'editOne 6', inserts)
            msg = 'The account for ' + member_firstname+ ' ' + member_lastname + ' has been modified, the email address is '+ account_email
        } else {
            sql = `UPDATE ${DB_PREFIX}accounts SET
										account_pass = ?,
										account_email = ?,
										member_firstname = ?,
										member_lastname = ?,
										member_year = ?,
										member_nickname = ?,
										member_position = ?,
										member_prev_club = ?,
										account_addr_street = ?,
										account_addr_street_ext = ?,
										account_addr_city = ?,
										account_addr_state = ?,
										account_addr_country = ?,
										account_addr_postal = ?,
										account_addr_phone = ?,
										member_show_addr = ?,
										member_show_phone = ?,
										newsletter_recipient = ?,
										mail_recipient = ?,
										sms_recipient = ?,
										member_pic_path = ?,
										member_wall_of_fame_year = ?,

										member_type_id = ?,
										member_type2_id = ?,
										member_admin_type_id  = ?,
										member_admin_type2_id  = ?,
										modified_dt= NOW()
									WHERE account_id = ?`

            let hashedpassword = md5(account_remind).substring(3,11)
            inserts.push(
                hashedpassword,
                account_email,
                member_firstname,
                member_lastname,
                member_year,
                member_nickname,
                member_position,
                member_prev_club,
                account_addr_street,
                account_addr_street_ext,
                account_addr_city,
                account_addr_state,
                account_addr_country,
                account_addr_postal,
                account_addr_phone,
                member_show_addr,
                member_show_phone,
                newsletter_recipient,
                mail_recipient,
                sms_recipient,
                member_pic_path,
                member_wall_of_fame_year,

                member_type_id,
                member_type2_id,
                member_admin_type_id,
                member_admin_type2_id,
                id
                )
								msg = 'The account for ' + member_firstname+ ' ' + member_lastname + '  has been modified the new password is '+ account_remind+' the email is '+ account_email
        }
        account = await doDBQuery(sql, inserts)
        account.error = ''
        notifyUser( msg, ORGANIZATION_EMAIL).catch(console.error);
    } else {
        account.error = 'A flag account with email ' + account_email + ' already exists'
        console.log(account.error)
    }
    return account
}

async function editByMember({
	account_email,
	member_firstname,
	member_lastname,
	account_addr_street,
	account_addr_street_ext,

	account_addr_city,
	account_addr_state,
	account_addr_country,
	account_addr_postal,
	account_addr_phone,

	member_year,
	member_prev_club,
	member_show_addr,
	member_show_phone,
	newsletter_recipient,

	sms_recipient,
	id
}) {

	// filename messsage, variable
	// activityLog('lookupByEmail', 'sql=', sql)

	let sql = `SELECT * FROM ${DB_PREFIX}accounts WHERE deleted = 0 AND account_id <> ${id}`
	accounts = await doDBQuery(sql)


	let account = accounts.find( u => u.account_email === account_email )

	if (!account) { // undefined - no other users with proposed email
	// filename messsage, variable
	// activityLog('lookupByEmail', 'sql=', sql)

			let inserts = []
			let msg = ''
			sql = `UPDATE ${DB_PREFIX}accounts SET
								account_email = ?,
								member_firstname = ?,
								member_lastname =  ?,
								member_year =  ?,
								member_prev_club =  ?,
								account_addr_street = ?,
								account_addr_street_ext = ?,
								account_addr_city = ?,
								account_addr_state = ?,
								account_addr_country = ?,
								account_addr_postal = ?,
								account_addr_phone = ?,
								member_show_addr = ?,
								member_show_phone = ?,
								newsletter_recipient = ?,
								sms_recipient = ?,
								modified_dt= NOW()
							WHERE account_id = ?`

	// filename messsage, variable
	// activityLog('editByMember', 'sql=', sql)

			inserts.push(
				account_email,
				member_firstname,
				member_lastname,
				member_year,
				member_prev_club,
				account_addr_street,
				account_addr_street_ext,
				account_addr_city,
				account_addr_state,
				account_addr_country,
				account_addr_postal,
				account_addr_phone,
				member_show_addr,
				member_show_phone,
				newsletter_recipient,
				sms_recipient,
				id
			)

			account = await doDBQuery(sql, inserts)

			account.error = ''
	// activityLog('editByMember', 'editByMember', 'before')
			msg = 'The account for ' + member_firstname+ ' ' + member_lastname + ' has been modified, the email address is '+ account_email
	// activityLog('editByMember', 'editByMember', msg)
		notifyUser( msg, account_email).catch(console.error);
	// activityLog('editByMember', 'editByMember', 'aafter')
		} else {
			account.error = 'An account with email ' + account_email + ' already exists'

	}
	return account
}

async function changeStatus({ id, status }) {
    const sql = `UPDATE ${DB_PREFIX}accounts SET STATUS = "` + status + `" WHERE account_id  = ` + id
    account = await doDBQuery(sql)
    return account
}

async function getMemberTypes() {
    const sql = `SELECT * FROM ${DB_PREFIX}member_types WHERE 1`
    membertypes = await doDBQuery(sql)
    return membertypes
}

async function getNewsLetterRecipientTypes() {
    const sql = `SELECT * FROM ${DB_PREFIX}recipient_types WHERE 1`
    recipienttypes = await doDBQuery(sql)
    return recipienttypes
}

async function getMemberAdminTypes() {
    const sql = `SELECT * FROM ${DB_PREFIX}member_admin_types WHERE 1`
    memberadmintypes = await doDBQuery(sql)
    return memberadmintypes
}
