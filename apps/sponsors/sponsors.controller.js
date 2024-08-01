const express = require('express');
const router = express.Router();
const sponsorsService = require('./sponsors.service');

////////////// ROUTES //////////////////////

router.get('/', getAll)
router.get('/current', getAllCurrent)
router.post('/status', changeStatus)
router.post('/add', addOne)
router.post('/edit', editOne)
router.get('/delete/:id', deleteOne)
router.get('/:id', getOne)

module.exports = router;

function addOne(req, res, next) {
    sponsorsService.addOne(req.body)
        .then(account => res.json(account))
        .catch(err => next(err))
}

function editOne(req, res, next) {
    sponsorsService.editOne(req.body)
        .then(account => res.json(account))
        .catch(err => next(err))
}

function getAll(req, res, next) {
    sponsorsService.getAll()
        .then(sponsors => res.json(sponsors))
        .catch(err => next(err))
}

function getAllCurrent(req, res, next) {
	sponsorsService.getAllCurrent()
			.then(sponsors => res.json(sponsors))
			.catch(err => next(err))
}

function getOne(req, res, next) {
    sponsorsService.getOne(req.params.id)
        .then(account => res.json(account))
        .catch(err => next(err))
}

function deleteOne(req, res, next) {
    sponsorsService.deleteOne(req.params.id)
        .then(account => res.json(account))
        .catch(err => next(err))
}

function changeStatus(req, res, next) {
    sponsorsService.changeStatus(req.body)
        .then( account => res.json(account) )
        .catch(err => next(err))
}
