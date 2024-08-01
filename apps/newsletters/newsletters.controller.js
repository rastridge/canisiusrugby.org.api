const express = require("express");
const router = express.Router();
const newslettersService = require("./newsletters.service");

////////////// ROUTES //////////////////////
router.get("/", getAll);
// router.get('/list', getAllList);
router.get("/track", trackNewsletter);
router.post("/add", addOne);
router.post("/edit", editOne);
router.post("/send", sendNewsletter);
router.post("/status", changeStatus);
router.get("/recipienttypes", getRecipientTypes);
router.get("/delete/:id", deleteOne);
router.get("/:id", getOne);

module.exports = router;

function getAll(req, res, next) {
	newslettersService
		.getAll()
		.then((news) => res.json(news))
		.catch((err) => next(err));
}

function trackNewsletter(req, res, next) {
	newslettersService
		.trackNewsletter(req.query)
		.then((news) => res.json(news))
		.catch((err) => next(err));
}

function sendNewsletter(req, res, next) {
	newslettersService
		.sendNewsletter(req.body)
		.then((newsletter) => res.json(newsletter))
		.catch((err) => next(err));
}

function getOne(req, res, next) {
	newslettersService
		.getOne(req.params.id)
		.then((news) => res.json(news))
		.catch((err) => next(err));
}

function addOne(req, res, next) {
	newslettersService
		.addOne(req.body)
		.then((news) => res.json(news))
		.catch((err) => next(err));
}

function editOne(req, res, next) {
	newslettersService
		.editOne(req.body)
		.then((news) => res.json(news))
		.catch((err) => next(err));
}

function changeStatus(req, res, next) {
	newslettersService
		.changeStatus(req.body)
		.then((newsletter) => res.json(newsletter))
		.catch((err) => next(err));
}

function deleteOne(req, res, next) {
	newslettersService
		.deleteOne(req.params.id)
		.then((news) => res.json(news))
		.catch((err) => next(err));
}
function getRecipientTypes(req, res, next) {
	newslettersService
		.getRecipientTypes()
		.then((recipienttypes) => res.json(recipienttypes))
		.catch((err) => next(err));
}
