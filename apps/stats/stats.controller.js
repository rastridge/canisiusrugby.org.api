const express = require('express');
const router = express.Router();

const statsService = require('./stats.service');

////////////// ROUTES //////////////////////
router.get('/', getAll);
router.get('/gametypes', getGameTypes);
router.get('/current', getAllCurrent);
router.get('/teamstats', getTeamStatsBySeason);
router.get('/teamstatstotal', getTeamStatsTotal);
router.get('/previous/:date', getPrevious);
router.get('/year/:year', getYear);
router.get('/adjacent/:direction', getAdjacent);
router.get('/playerstats/:id', getPlayerStats);
router.get('/delete/:id', deleteOne);
router.get('/players/:id', getPlayers);
router.get('/playergames/:id', playerGamesPlayed);
router.get('/:id', getOne);
router.post('/add', addOne);
router.post('/edit', editOne);
router.post('/status', changeStatus);

module.exports = router;

function getAll(req, res, next) {
    statsService.getAll()
        .then(stats => res.json(stats))
        .catch(err => next(err));
}
function getPrevious(req, res, next) {
    statsService.getPrevious(req.params.date)
        .then(stats => res.json(stats))
        .catch(err => next(err));
}
function getYear(req, res, next) {
    statsService.getYear(req.params.year)
        .then(stats => res.json(stats))
        .catch(err => next(err));
}
function getGameTypes(req, res, next) {
    statsService.getGameTypes()
        .then(stats => res.json(stats))
        .catch(err => next(err));
}
function getAdjacent(req, res, next) {
    statsService.getAdjacent(req.params.direction)
        .then(stats => res.json(stats))
        .catch(err => next(err));
}

function getAllCurrent(req, res, next) {
    statsService.getAllCurrent()
        .then(stats => res.json(stats))
        .catch(err => next(err));
}

function getOne(req, res, next) {
    statsService.getOne(req.params.id)
        .then(stats => res.json(stats))
        .catch(err => next(err));
}

function getPlayerStats(req, res, next) {
    statsService.getPlayerStats(req.params.id)
        .then(stats => res.json(stats))
        .catch(err => next(err));
}

function playerGamesPlayed(req, res, next) {
    statsService.playerGamesPlayed(req.params.id)
        .then(stats => res.json(stats))
        .catch(err => next(err));
}

function getTeamStatsBySeason(req, res, next) {
    statsService.getTeamStatsBySeason()
        .then(stats => res.json(stats))
        .catch(err => next(err));
}

function getTeamStatsTotal(req, res, next) {
    statsService.getTeamStatsTotal()
        .then(stats => res.json(stats))
        .catch(err => next(err));
}

function getPlayers(req, res, next) {
    statsService.getPlayers(req.params.id)
        .then(stats => res.json(stats))
        .catch(err => next(err));
}

function addOne(req, res, next) {
    statsService.addOne(req.body)
        .then(stats => res.json(stats))
        .catch(err => next(err));
}

function editOne(req, res, next) {
    statsService.editOne(req.body)
        .then(stats => res.json(stats))
        .catch(err => next(err))
}

function changeStatus(req, res, next) {
    statsService.changeStatus(req.body)
        .then(
            stats => res.json(stats),
        )
        .catch(err => next(err));
}

function deleteOne(req, res, next) {
    statsService.deleteOne(req.params.id)
        .then(stats => res.json(stats))
        .catch(err => next(err));
}
