const express = require('express');
const router = express.Router();
const clubhouseService = require('./clubhouse.service');

////////////// ROUTES //////////////////////
router.get('/', getAll);
router.get('/delete/:id', deleteOne);
router.get('/:id', getOne);
router.post('/add', addOne);
router.post('/edit', editOne);
router.post('/status', changeStatus);

module.exports = router;

function getAll(req, res, next) {
    clubhouseService.getAll()
        .then(clubhouse => res.json(clubhouse))
        .catch(err => next(err));
}

function getOne(req, res, next) {
    clubhouseService.getOne(req.params.id)
        .then(clubhouse => res.json(clubhouse))
        .catch(err => next(err));
}

function addOne(req, res, next) {
    clubhouseService.addOne(req.body)
        .then(clubhouse => res.json(clubhouse))
        .catch(err => next(err));
}

function editOne(req, res, next) {
    clubhouseService.editOne(req.body)
        .then(clubhouse => res.json(clubhouse))
        .catch(err => next(err))
}

function changeStatus(req, res, next) {
    clubhouseService.changeStatus(req.body)
        .then(
            video => res.json(video),
        )
        .catch(err => next(err));
}

function deleteOne(req, res, next) {
    clubhouseService.deleteOne(req.params.id)
        .then(video => res.json(video))
        .catch(err => next(err));
}
