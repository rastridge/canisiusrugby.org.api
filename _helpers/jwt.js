const expressJwt = require("express-jwt");
const { JWT_SECRET } = require("config");

module.exports = jwt;

function jwt() {
	return expressJwt({ secret: JWT_SECRET }).unless({
		path: [
			// public routes that don't require authentication
			// authentication
			// public info
			//
			// or access for nominators and nominees forms
			"/", // filemanager
			"//test", //
			"//api/test", //

			"//accounts", //
			"//accounts/addbyregister", //
			"//accounts/add", //
			"//accounts/public", //
			"//accounts/officers", //
			"//accounts/recent", //
			"//accounts/wof", // getWOFMembers
			"//accounts/editbymember", // editByMember
			/\/accounts\/type\/[1-9]+/, //getMembersOfType
			/\/accounts\/[1-9]+/, // getOne
			"//archive", // getAll
			"//archive/doc", // setDoc
			/\/archive\/[1-9]+/, // getOne
			"//clubhouse", // getAll
			/\/clubhouse\/[1-9]+/, // getOne
			"//content", // getAll
			"//content/menu", // getCustomMenuItems
			/\/content\/[1-9]+/, // getOne
			"//contributions", // getAll
			"//contributions/current", // getAllCurrent
			"//contributions/top", // getTopContributors
			/\/contributions\/total\/[1-9]+/, // getTotal
			/\/contributions\/previous\/[1-9]+/, // getPrevious
			/\/contributions\/year\/[1-9]+/, // getYear
			/\/contributions\/[1-9]+/, // getOne
			"/discipline/public", //
			/\/discipline\/[1-9]+/, // getOne
			/\/image\/*/,
			"//newsletters", // getAll
			"//newsletters/track", // trackNewsletter
			// '/newsletters/list', // trackNewsletter
			/\/newsletters\/[1-9]+/, // getOne
			"//news", // getAll
			"//news/current", // getAllCurrent
			/\/news\/[1-9]+/, // getOne
			"//payments", // getAll
			"//payments/current", // getAllCurrent
			/\/payments\/[1-9]+/, // getOne
			"//sms", // getAll
			"//sms/MessageStatus", // messageStatus
			/\/sms\/[1-9]+/, // getOne
			"//sponsors", // getAll
			"//sponsors/current", // getAllCurrent
			/\/sponsors\/[1-9]+/, // getOne
			"//statss", // getAll
			"//statss/gametypes", // getGameTypes
			"//statss/teamstats", // getTeamStats
			"/statss/teamstatstotal", // getTeamStatsTotal
			/\/statss\/playergames\/[1-9]+/, // playerGamesPlayed
			/\/statss\/previous\/[\-,0-9]+/, // getPrevious
			/\/statss\/year\/[1-9]+/, // getYear
			/\/statss\/players\/[1-9]+/, // getPlayers
			/\/statss\/playerstats\/[1-9]+/, // getPlayerStats
			/\/statss\/adjacent\/[a-z]+/, // getAdjacent
			/\/statss\/[1-9]+/, // getOne
			"//supportingaccounts", // getAll
			"//supportingaccounts/current", // getAllCurrent
			/\/supportingaccounts\/[1-9]+/, // getOne
			"//users/authenticate", // login
			"//users/resetrequest", // resetRequest
			"//users/resetpassword", // resetPassword
			"//videos", // getAll
			/\/videos\/[1-9]+/, // getOne
			"//votes", // getAll
			"//votes/sendballot", // sendBallot
			"//votes/registerballot", // registerBallot
			"//votes/usedchoices", // getUsedChoices
			// /\/votes\/questions\/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, // getQuestions
			/\/votes\/questions\/[a-z]+/, // getQuestions
			/\/votes\/allchoices\/[1-9]+/, // getAllChoices
			/\/votes\/[1-9]+/, // getOne
		],
	});
}
