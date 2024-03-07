const express = require('express');
const router = express.Router();

const newsService = require('./news.service');

////////////// ROUTES //////////////////////
router.get('/', getAll);
router.get('/current', getAllCurrent);
router.get('/recipienttypes', getNewsLetterRecipientTypes);
router.get('/delete/:id', deleteOne);
router.get('/:id', getOne);
router.post('/add', addOne);
router.post('/edit', editOne);
router.post('/status', changeStatus);

module.exports = router;

function getAll(req, res, next) {
    newsService.getAll()
        .then(news => res.json(news))
        .catch(err => next(err));
}

function getAllCurrent(req, res, next) {
    newsService.getAllCurrent()
        .then(news => res.json(news))
        .catch(err => next(err));
}

function getNewsLetterRecipientTypes(req, res, next) {
    newsService.getNewsLetterRecipientTypes()
        .then(news => res.json(news))
        .catch(err => next(err));
}

function getOne(req, res, next) {
    newsService.getOne(req.params.id)
        .then(news => res.json(news))
        .catch(err => next(err));
}

function addOne(req, res, next) {
    newsService.addOne(req.body)
        .then(news => res.json(news))
        .catch(err => next(err));
}

function editOne(req, res, next) {
    newsService.editOne(req.body)
        .then(news => res.json(news))
        .catch(err => next(err))
}

function changeStatus(req, res, next) {
    newsService.changeStatus(req.body)
        .then(
            news => res.json(news),
        )
        .catch(err => next(err));
}

function deleteOne(req, res, next) {
    newsService.deleteOne(req.params.id)
        .then(news => res.json(news))
        .catch(err => next(err));
}
