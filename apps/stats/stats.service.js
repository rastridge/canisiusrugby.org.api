const mysql = require('mysql2/promise')
const { DB_PREFIX, DB } = require('config')
const doDBQuery = require('_helpers/do-query')

module.exports = {
	getAll,
	getOne,
	addOne,
	editOne,
	getYear,
	getAdjacent,
	getPrevious,
	getGameTypes,
	getPlayerStats,
	playerGamesPlayed,
	getTeamStatsBySeason,
	getTeamStatsTotal,
	getPlayers,
	deleteOne,
	changeStatus
}

async function getAll(sort='DESC') {

	sql = `SELECT
				game_id,
				game_id as id,
				opponent,
				opponent as title,
				referee,
				venue,
				comment,
				date,
				date as dt,
				KO_time,
				t.game_type,
				t.game_type_id,
				game_level,
				ptsFor,
				ptsAgn,
				game_image,
				g.Status,
				g.Status as status,
				g.deleted,
				g.deleted_dt,
				g.created_dt,
				g.modified_dt
			FROM
				${DB_PREFIX}stats_game_types t,
				${DB_PREFIX}stats_games g
			WHERE
				g.deleted = 0
				AND g.Status = 1
				AND t.game_type_id = g.game_type_id
			ORDER BY
				date ` + sort

		games = await doDBQuery(sql)
		return  games
}

async function getPrevious(date) {

	sql = `SELECT
						game_id,
						opponent,
						date,
						DATE_FORMAT(date, '%Y %M %e') dt,
						game_level
					FROM
						${DB_PREFIX}stats_games
					WHERE
						deleted = 0
						AND Status = 1
						AND date < '${date}'
					ORDER BY
						date DESC
					LIMIT 10`

		games = await doDBQuery(sql)
		return  games
}

async function getYear(year) {

	const YEAR2 = parseInt(year) + 1

	sql = `SELECT
				game_id,
				game_id as id,
				opponent,
				opponent as title,
				referee,
				venue,
				comment,
				date,
				date as dt,
				KO_time,
				t.game_type,
				t.game_type_id,
				game_level,
				ptsFor,
				ptsAgn,
				game_image,
				g.Status,
				g.Status as status,
				g.deleted,
				g.deleted_dt,
				g.created_dt,
				g.modified_dt
			FROM
				${DB_PREFIX}stats_game_types t,
				${DB_PREFIX}stats_games g
			WHERE
				g.deleted = 0
				AND g.Status = 1
				AND t.game_type_id = g.game_type_id
				AND ( YEAR(date) = ${year} OR YEAR(date) = ${YEAR2} )
			ORDER BY
				date DESC`

		games = await doDBQuery(sql)

		return  games
}

async function getGameTypes() {

	sql = `SELECT
				game_type,
				game_type_id
			FROM
				${DB_PREFIX}stats_game_types
			WHERE 1`

	gametypes = await doDBQuery(sql)

	return  gametypes
}

async function getOne(id) {

	const sql = `SELECT
									g.game_id,
									g.opponent,
									g.referee,
									g.venue,
									g.comment,
									g.date,
									DATE_FORMAT(g.date, '%Y-%m-%d') dt,
									g.KO_time,
									g.game_type_id,
									t.game_type,
									g.game_level,
									g.ptsFor,
									g.ptsAgn,
									g.game_image,
									g.status,
									g.created_dt,
									g.modified_dt
								FROM
									${DB_PREFIX}stats_games g, ${DB_PREFIX}stats_game_types t
								WHERE
										g.game_id=${id}
									AND g.game_type_id = t.game_type_id`

	games = await doDBQuery(sql)

	return games[0]
}

/* get adjacent games */
async function getAdjacent(direction) {

	let FILTER = ''
	let FILTER2 = ''

	if(direction == 'next') {
		FILTER = '>='
		FILTER2 = 'ASC, KO_time ASC'
	} else {
		FILTER = '<='
		FILTER2 = 'DESC, KO_time DESC'
	}

	const sql = `SELECT
								opponent,
								referee,
								venue,
								date,
								date as dt,
								KO_time,
								t.game_type,
								game_level,
								ptsFor,
								ptsAgn
							FROM
								${DB_PREFIX}stats_game_types t,
								${DB_PREFIX}stats_games g
							WHERE
								t.game_type_id = g.game_type_id
								AND DATE(date) ${FILTER} CURDATE()
								AND Status = 1
								AND deleted = 0
							ORDER BY
								date ${FILTER2}
							LIMIT 2`

	stats = await doDBQuery(sql)
	return stats
}

async function getPlayers(id) {

	const sql = `SELECT
								position_id,
								player_id,
								a1.member_firstname pfn,
								a1.member_lastname pln,
								a2.member_firstname rfn,
								a2.member_lastname rln,
								tries,
								assists,
								conv,
								penk,
								dgoal,
								yellow,
								red,
								replaced_by
							FROM ${DB_PREFIX}stats_player p
								left join ${DB_PREFIX}accounts a1 on a1.account_id = p.player_id
								left join ${DB_PREFIX}accounts a2 on a2.account_id = p.replaced_by
							WHERE
								p.deleted=0
								AND p.game_id=${id}
							ORDER BY
								position_id asc`

	players = await doDBQuery(sql)
	return players
}

async function getPlayerStats(id) {

	let FILTER = ''
	if (id == '7' ) {
		FILTER = ' = 7' ;
	} else {
		FILTER = ' != 7' ;
	};

	const sql = `SELECT
								a.member_year as year,
								IF(a.member_type_id = '2', true, false) as isactive,
								concat(a.member_firstname,' ', a.member_lastname ) as name,
								count(p.player_id) as games,
								sum(p.tries) as tries,
								sum(p.conv) as conv,
								sum(p.penk) as pk,
								sum(p.dgoal) as dg,
								sum(p.yellow) as yellow ,
								sum(p.red) as red,
								sum(p.tries)*5+sum(p.conv)*2 + sum(p.penk)*3 + sum(p.dgoal)*3 as pts,
								sum(p.tries) / count(p.player_id) as tpg
							FROM
								${DB_PREFIX}stats_player p,
								${DB_PREFIX}accounts a,
								${DB_PREFIX}stats_games g
							WHERE
								(p.player_id = a.account_id)
								AND (p.game_id= g.game_id)
								AND (g.game_type_id ${FILTER})
							GROUP BY
								p.player_id
							ORDER BY
								games desc`
	stats = await doDBQuery(sql)
	return stats
}
// async function getTeamStatsBySeason($aFilter, $aFilter2, $aFilter3) {

async function getTeamStatsBySeason() {

/*
		//	Game type
				if ( empty($aFilter)) {
					$filter = "";
				} else {
					$filter = " AND ( game_type LIKE '".$aFilter[0]."' ";
					for ($i=1; $i < count($aFilter) ;$i++) {
						$filter .= "OR game_type LIKE '". $aFilter[$i]."' ";
					}
					$filter .= " ) ";
				}

		//	Game Level
				if ( empty($aFilter2)) {
					$filter2 = "";
				} else {
					$filter2 = " AND ( game_level = '".$aFilter2[0]."' ";
					for ($i=1; $i < count($aFilter2) ;$i++) {
						$filter2 .= "OR game_level = '". $aFilter2[$i]."' ";
					}
					$filter2 .= " ) ";
				}

		//	Venue
				if ( empty($aFilter3) OR count($aFilter3)>1) {
					$filter3 = "";
				} else {
						if(!strcmp($aFilter3[0],"H")) {
							$filter3 = " AND venue LIKE '%elaware%' ";
						} else {
							$filter3 = " AND venue NOT LIKE '%elaware%' ";
						};
				}

			$sql = "SELECT
						COUNT(game_id) as game_count,
						IF( (EXTRACT(MONTH FROM date) > 7) AND (EXTRACT(MONTH FROM date) <= 12) , concat(EXTRACT(YEAR FROM date),' Fall'), CONCAT(EXTRACT(YEAR FROM date), ' Spring ')) as season,
						IF( (EXTRACT(MONTH FROM date) > 7) AND (EXTRACT(MONTH FROM date) <= 12) , 'Fall', 'Spring ') as half,
						EXTRACT(YEAR FROM date) as year,
						SUM(IF(ptsFor>ptsAgn,1,0)) as wins,
						SUM(IF(ptsFor<ptsAgn,1,0)) as losses,
						SUM(IF(ptsFor=ptsAgn AND ptsFor != 0 ,1,0)) as ties,
						SUM(IF((ptsFor=0) AND (ptsAgn=0),1,0)) as unknown
					 FROM
						 ".PREFIX2."_stats_game_types t,
						 ".PREFIX2."_stats_games g
					 WHERE
						(t.game_type_id = g.game_type_id )
						".$filter."
						".$filter2."
						".$filter3."
						AND Status = 1
					 GROUP BY
						season
					ORDER BY
						year DESC, half ASC";
	*/
	const sql = `SELECT
						COUNT(game_id) as game_count,
						IF( (EXTRACT(MONTH FROM date) > 7) AND (EXTRACT(MONTH FROM date) <= 12) , concat(EXTRACT(YEAR FROM date),' Fall'), CONCAT(EXTRACT(YEAR FROM date), ' Spring ')) as season,
						IF( (EXTRACT(MONTH FROM date) > 7) AND (EXTRACT(MONTH FROM date) <= 12) , 'Fall', 'Spring ') as half,
						EXTRACT(YEAR FROM date) as year,
						SUM(IF(ptsFor>ptsAgn,1,0)) as wins,
						SUM(IF(ptsFor<ptsAgn,1,0)) as losses,
						SUM(IF(ptsFor=ptsAgn AND ptsFor != 0 ,1,0)) as ties,
						SUM(IF((ptsFor=0) AND (ptsAgn=0),1,0)) as unknown
					FROM
						${DB_PREFIX}stats_game_types t,
						${DB_PREFIX}stats_games g
					WHERE
						(t.game_type_id = g.game_type_id )
						AND Status = 1
					GROUP BY
						season
					ORDER BY
						year DESC, half ASC`

	stats = await doDBQuery(sql)
	return stats
}

async function getTeamStatsTotal() {

	const sql = `SELECT
						COUNT(game_id) as game_count,
						SUM(IF(ptsFor>ptsAgn,1,0)) as wins,
						SUM(IF(ptsFor<ptsAgn,1,0)) as losses,
						SUM(IF(ptsFor=ptsAgn AND ptsFor != 0 ,1,0)) as ties,
						SUM(IF((ptsFor=0) AND (ptsAgn=0),1,0)) as unknown
					FROM
						${DB_PREFIX}stats_game_types t,
						${DB_PREFIX}stats_games g
					WHERE
						(t.game_type_id = g.game_type_id )
						AND Status = 1`

		stats = await doDBQuery(sql)
		return stats[0]
}

async function playerGamesPlayed(id) {

	sql = `SELECT
					a.member_lastname,
					a.member_firstname,
					g.opponent,
					g.game_type_id,
					t.game_type,
					g.venue,
					g.date,
					g.ptsFor,
					g.ptsAgn,
					p.tries,
					p.assists,
					p.conv,
					p.penk,
					p.dgoal,
					p.yellow,
					p.red,
					g.game_id
				FROM
				 ${DB_PREFIX}stats_player p,
				 ${DB_PREFIX}stats_games g,
				 ${DB_PREFIX}accounts a,
				 ${DB_PREFIX}stats_game_types t
				WHERE
					p.player_id = ${id}
					AND
					p.game_id = g.game_id
					AND
					p.player_id = a.account_id
					AND
					g.game_type_id = t.game_type_id
				ORDER BY
					g.date DESC`

	stats = await doDBQuery(sql)

	return stats
}

async function addOne({ opponent, referee, venue, comment, date, KO_time, game_type_id, game_level, ptsFor, ptsAgn, game_image, players }) {


	const conn = await mysql.createConnection({
		host: DB.DB_HOST,
		user: DB.DB_USER,
		password: DB.DB_PASSWORD,
		database: DB.DB_DATABASE
	})

	try {

		await conn.query('START TRANSACTION')

		let sql = `INSERT INTO ${DB_PREFIX}stats_games SET
									opponent = ?,
									referee = ?,
									venue = ?,
									comment = ?,
									date = ?,
									KO_time = ?,
									game_type_id = ?,
									game_level = ?,
									ptsFor = ?,
									ptsAgn = ?,
									game_image = ?,
									status = 1,
									deleted = 0,
									created_dt = NOW(),
									modified_dt = NOW()`

		let inserts = []
		inserts.push(opponent, referee, venue, comment, date, KO_time, game_type_id, game_level, ptsFor, ptsAgn, game_image)
		sql = mysql.format(sql, inserts)
		// console.log('gothere addOne = sql',sql)
		const [rows, fields] = await conn.execute(sql)
		const id = rows.insertId
		// console.log('gothere id = ', id)
		// add records for 23 players
		players.forEach(function (player) {
			let	sql = `INSERT INTO ${DB_PREFIX}stats_player SET
									game_id = ${id},
									position_id = ?,
									player_id = ?,
									replaced_by = ?,
									tries = ?,
									assists = ?,
									conv = ?,
									penk = ?,
									dgoal = ?,
									yellow = ?,
									red = ?,
									Status = 1,
									deleted = 0,
									modified_dt = NOW(),
									created_dt = NOW()`
			let inserts = []
			inserts.push(player.position_id, player.player_id, player.replaced_by, player.tries, player.assists, player.conv, player.penk, player.dgoal, player.yellow, player.red)
			const preppedsql = mysql.format(sql, inserts)
			conn.execute(preppedsql)
			// console.log('gothere2 preppedsql = ', preppedsql)

		})
		await conn.commit()
		await conn.end()
		return 'commit'
	}
	catch(e) {
		await conn.query('ROLLBACK')
		await conn.end()
		return 'rollback'
	}
}

async function editOne({ id,  opponent, referee, venue, comment, date, KO_time, game_type_id, game_level, ptsFor, ptsAgn, game_image, players }) {

	const conn = await mysql.createConnection({
		host: DB.DB_HOST,
		user: DB.DB_USER,
		password: DB.DB_PASSWORD,
		database: DB.DB_DATABASE
	})

	try {

		await conn.query('START TRANSACTION')

		let sql = `UPDATE ${DB_PREFIX}stats_games SET
								opponent = ?,
								referee = ?,
								venue = ?,
								comment = ?,
								date = ?,
								KO_time = ?,
								game_type_id = ?,
								game_level = ?,
								ptsFor = ?,
								ptsAgn = ?,
								game_image = ?,
								status = 1,
								deleted = 0,
								modified_dt= NOW()
							WHERE
								game_id = ?`

		let inserts = []
		inserts.push(opponent, referee, venue, comment, date, KO_time, game_type_id, game_level, ptsFor, ptsAgn, game_image, id)
		sql = mysql.format(sql, inserts)
		conn.execute(sql)

		// add new records for 23 players
		players.forEach(function (player) {
			let inserts = []
			inserts.push(player.player_id, player.replaced_by, player.tries, player.assists, player.conv, player.penk, player.dgoal, player.yellow, player.red, id, player.position_id)

			let sql = `UPDATE ${DB_PREFIX}stats_player SET
									player_id = ?,
									replaced_by = ?,
									tries = ?,
									assists = ?,
									conv = ?,
									penk = ?,
									dgoal = ?,
									yellow = ?,
									red = ?,
									modified_dt = NOW()
								WHERE
									game_id = ? AND position_id = ?`

			const preppedsql = mysql.format(sql, inserts)
			conn.execute(preppedsql)
		})
		await conn.commit()
		await conn.end()
		return 'committed'
	} catch(e) {
		await conn.query('ROLLBACK')
		await conn.end()
		return 'ROLLBACK'
	}
}

async function deleteOne(id) {

	const conn = await mysql.createConnection({
		host: DB.DB_HOST,
		user: DB.DB_USER,
		password: DB.DB_PASSWORD,
		database: DB.DB_DATABASE
	})

	try {
		await conn.query('START TRANSACTION')

		let sql = `UPDATE ${DB_PREFIX}stats_games SET deleted = 1, deleted_dt = NOW() WHERE game_id = ${id}`
		conn.execute(sql)

		sql = `UPDATE ${DB_PREFIX}stats_player SET deleted = 1, deleted_dt = NOW() WHERE game_id = ${id}`
		conn.execute(sql)

		await conn.commit()
		await conn.end()
		return 'COMMIT'
	}
	catch(e) {
		await conn.query('ROLLBACK')
		await conn.end()
		return 'ROLLBACK'
	}
}

async function changeStatus({ id, status }) {
	const sql = `UPDATE ${DB_PREFIX}stats_games SET status = "` + status + `" WHERE game_id = ${id}`
	players = await doDBQuery(sql)

	return players
}
