const express = require('express');
const router = express.Router();
const contributionsService = require('./contributions.service');

////////////// ROUTES //////////////////////
router.get('/', getAll);
router.get('/year/:year', getYear);
router.get('/previous/:id', getPrevious);
router.get('/current', getAllCurrent);
router.get('/top', getTopContributors);
router.get('/total/:year', getTotal);
router.get('/delete/:id', deleteOne);
router.get('/:id', getOne);
router.post('/add', addOne);
router.post('/edit', editOne);
router.post('/status', changeStatus);

module.exports = router;

function getAll(req, res, next) {
    contributionsService.getAll()
        .then(contributions => res.json(contributions))
        .catch(err => next(err));
}

function getAllCurrent(req, res, next) {
    contributionsService.getAllCurrent()
        .then(contributions => res.json(contributions))
        .catch(err => next(err));
}

function getTopContributors(req, res, next) {
    contributionsService.getTopContributors()
        .then(contributions => res.json(contributions))
        .catch(err => next(err));
}

function getPrevious(req, res, next) {
    contributionsService.getPrevious(req.params.id)
        .then(contributions => res.json(contributions))
        .catch(err => next(err));
}

function getYear(req, res, next) {
    contributionsService.getYear(req.params.year)
        .then(contributions => res.json(contributions))
        .catch(err => next(err));
}
function getTotal(req, res, next) {
    contributionsService.getTotal(req.params.year)
        .then(total => res.json(total))
        .catch(err => next(err));
}

function getOne(req, res, next) {
    contributionsService.getOne(req.params.id)
        .then(contributions => res.json(contributions))
        .catch(err => next(err));
}

function addOne(req, res, next) {
    contributionsService.addOne(req.body)
        .then(contributions => res.json(contributions))
        .catch(err => next(err));
}

function editOne(req, res, next) {
    contributionsService.editOne(req.body)
        .then(contributions => res.json(contributions))
        .catch(err => next(err))
}

function changeStatus(req, res, next) {
    contributionsService.changeStatus(req.body)
        .then(
            contributions => res.json(contributions),
        )
        .catch(err => next(err));
}

function deleteOne(req, res, next) {
    contributionsService.deleteOne(req.params.id)
        .then(contributions => res.json(contributions))
        .catch(err => next(err));
}
