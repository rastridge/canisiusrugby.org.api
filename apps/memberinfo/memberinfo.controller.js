const express = require("express");
const router = express.Router();
const fs = require("fs");

const memberinfoService = require("./memberinfo.service");

////////////// ROUTES //////////////////////
router.get("/", getAll);
router.post("/makelabels", makeLabels);

module.exports = router;

function getAll(req, res, next) {
	memberinfoService
		.getAll()
		.then((memberinfo) => res.json(memberinfo))
		.catch((err) => next(err));
}

function makeLabels(req, res, next) {
	memberinfoService
		.makeLabels(req.body)
		.then((labels) => res.json(labels))
		.catch((err) => next(err));
}
