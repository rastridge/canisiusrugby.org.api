const express = require('express');
const router = express.Router();
const supportingaccountsService = require('./supportingaccounts.service');

////////////// ROUTES //////////////////////
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/delete/:id', deleteOne);
router.get('/:id', getOne);
router.post('/add', addOne);
router.post('/edit', editOne);
router.post('/status', changeStatus);

module.exports = router;

function getAll(req, res, next) {
    supportingaccountsService.getAll()
        .then(supportingaccounts => res.json(supportingaccounts))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
	supportingaccountsService.getCurrent()
			.then(supportingaccounts => res.json(supportingaccounts))
			.catch(err => next(err));
}

function getOne(req, res, next) {
    supportingaccountsService.getOne(req.params.id)
        .then(supportingaccounts => res.json(supportingaccounts))
        .catch(err => next(err));
}

function addOne(req, res, next) {
    supportingaccountsService.addOne(req.body)
        .then(supportingaccounts => res.json(supportingaccounts))
        .catch(err => next(err));
}

function editOne(req, res, next) {
    supportingaccountsService.editOne(req.body)
        .then(supportingaccounts => res.json(supportingaccounts))
        .catch(err => next(err))
}

function changeStatus(req, res, next) {
    supportingaccountsService.changeStatus(req.body)
        .then(
            supportingaccounts => res.json(supportingaccounts),
        )
        .catch(err => next(err));
}

function deleteOne(req, res, next) {
    supportingaccountsService.deleteOne(req.params.id)
        .then(supportingaccounts => res.json(supportingaccounts))
        .catch(err => next(err));
}
