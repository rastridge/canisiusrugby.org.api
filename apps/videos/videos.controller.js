const express = require('express');
const router = express.Router();
const videosService = require('./videos.service');

////////////// ROUTES //////////////////////
router.get('/', getAll);
router.get('/delete/:id', deleteOne);
router.get('/:id', getOne);
router.post('/add', addOne);
router.post('/edit', editOne);
router.post('/status', changeStatus);

module.exports = router;

function getAll(req, res, next) {
    videosService.getAll()
        .then(video => res.json(video))
        .catch(err => next(err));
}

function getOne(req, res, next) {
    videosService.getOne(req.params.id)
        .then(video => res.json(video))
        .catch(err => next(err));
}

function addOne(req, res, next) {
    videosService.addOne(req.body)
        .then(video => res.json(video))
        .catch(err => next(err));
}

function editOne(req, res, next) {
    videosService.editOne(req.body)
        .then(video => res.json(video))
        .catch(err => next(err))
}

function changeStatus(req, res, next) {
    videosService.changeStatus(req.body)
        .then(
            video => res.json(video),
        )
        .catch(err => next(err));
}

function deleteOne(req, res, next) {
    videosService.deleteOne(req.params.id)
        .then(video => res.json(video))
        .catch(err => next(err));
}
