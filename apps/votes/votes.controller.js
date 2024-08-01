const express = require("express");
const router = express.Router();
const votesService = require("./votes.service");

////////////// ROUTES //////////////////////

router.get("/", getAll);
router.get("/questions/:account_email", getQuestions);
router.get("/delete/:id", deleteOne);
router.get("/allchoices/:id", getAllChoices);
router.get("/usedchoices", getUsedChoices);
router.get("/:id", getOne);
router.post("/sendballot", sendBallot);
router.post("/registerballot", registerBallot);
router.post("/add", addOne);
router.post("/edit", editOne);
router.post("/status", changeStatus);

module.exports = router;

function addOne(req, res, next) {
	votesService
		.addOne(req.body)
		.then((votes) => res.json(votes))
		.catch((err) => next(err));
}

function editOne(req, res, next) {
	votesService
		.editOne(req.body)
		.then((votes) => res.json(votes))
		.catch((err) => next(err));
}

function getAll(req, res, next) {
	votesService
		.getAll()
		.then((votes) => res.json(votes))
		.catch((err) => next(err));
}

function getOne(req, res, next) {
	votesService
		.getOne(req.params.id)
		.then((votes) => res.json(votes))
		.catch((err) => next(err));
}

function sendBallot(req, res, next) {
	votesService
		.sendBallot(req.body)
		.then((votes) => res.json(votes))
		.catch((err) => next(err));
}

function registerBallot(req, res, next) {
	votesService
		.registerBallot(req.body)
		.then((votes) => res.json(votes))
		.catch((err) => next(err));
}

function getAllChoices(req, res, next) {
	votesService
		.getAllChoices(req.params.id)
		.then((choices) => res.json(choices))
		.catch((err) => next(err));
}

function getUsedChoices(req, res, next) {
	votesService
		.getUsedChoices(req.params.id)
		.then((choices) => res.json(choices))
		.catch((err) => next(err));
}

function getQuestions(req, res, next) {
	votesService
		.getQuestions(req.params.account_email)
		.then((questions) => res.json(questions))
		.catch((err) => next(err));
}

function deleteOne(req, res, next) {
	votesService
		.deleteOne(req.params.id)
		.then((votes) => res.json(votes))
		.catch((err) => next(err));
}
function changeStatus(req, res, next) {
	votesService
		.changeStatus(req.body)
		.then((votes) => res.json(votes))
		.catch((err) => next(err));
}
