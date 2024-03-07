const express = require('express');
const router = express.Router();
const paymentsService = require('./payments.service');

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
    paymentsService.getAll()
        .then(content => res.json(content))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    paymentsService.getCurrent()
        .then(content => res.json(content))
        .catch(err => next(err));
}

function getOne(req, res, next) {
    paymentsService.getOne(req.params.id)
        .then(content => res.json(content))
        .catch(err => next(err));
}

function addOne(req, res, next) {
    paymentsService.addOne(req.body)
        .then(content => res.json(content))
        .catch(err => next(err));
}

function editOne(req, res, next) {
    paymentsService.editOne(req.body)
        .then(content => res.json(content))
        .catch(err => next(err))
}

function changeStatus(req, res, next) {
    paymentsService.changeStatus(req.body)
        .then(
            content => res.json(content),
        )
        .catch(err => next(err));
}

function deleteOne(req, res, next) {
    paymentsService.deleteOne(req.params.id)
        .then(content => res.json(content))
        .catch(err => next(err));
}
