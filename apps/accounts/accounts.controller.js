const express = require('express');
const router = express.Router();
const accountsService = require('./accounts.service');
const activityLog = require('_helpers/activity-log')

////////////// ROUTES //////////////////////

router.post('/status', changeStatus)
router.post('/add', addOne)
router.post('/addbyregister', addOneByRegister)
router.post('/edit', editOne)
router.post('/editbymember', editByMember)
router.get('/membertypes', getMemberTypes)
router.get('/newsletterrecipienttypes', getNewsLetterRecipientTypes)
router.get('/memberadmintypes', getMemberAdminTypes)
router.get('/public', getAllPublic)
router.get('/officers', getOfficers)
router.get('/recent', getRecentUpdates)
router.get('/email/:email', lookupByEmail)
router.get('/wof', getWof)
router.get('/type/:id', getType)
router.get('/:id', getOne)
router.get('/delete/:id', deleteOne)
router.get('/', getAll)

module.exports = router;

function addOne(req, res, next) {
    accountsService.addOne(req.body)
        .then(account => res.json(account))
        .catch(err => next(err))
}

function addOneByRegister(req, res, next) {
	accountsService.addOne(req.body)
			.then(account => res.json(account))
			.catch(err => next(err))
}

function editOne(req, res, next) {
	accountsService.editOne(req.body)
        .then(account => res.json(account))
        .catch(err => next(err))
}

function getOne(req, res, next) {
	accountsService.getOne(req.params.id)
			.then(account => res.json(account))
			.catch(err => next(err))
}

function editByMember(req, res, next) {
	accountsService.editByMember(req.body)
			.then(account => res.json(account))
			.catch(err => next(err))
}

function getAll(req, res, next) {
    accountsService.getAll()
        .then(accounts => res.json(accounts))
        .catch(err => next(err))
}

function getType(req, res, next) {
    accountsService.getType(req.params.id)
        .then(accounts => res.json(accounts))
        .catch(err => next(err))
}
function getAllPublic(req, res, next) {
    accountsService.getAllPublic()
        .then(accounts => res.json(accounts))
        .catch(err => next(err))
}
function getOfficers(req, res, next) {
    accountsService.getOfficers()
        .then(accounts => res.json(accounts))
        .catch(err => next(err))
}
function lookupByEmail(req, res, next) {
	accountsService.lookupByEmail(req.params.email)
			.then(account => res.json(account))
			.catch(err => next(err))
}
function getRecentUpdates(req, res, next) {
	accountsService.getRecentUpdates()
			.then(accounts => res.json(accounts))
			.catch(err => next(err))
}
function getWof(req, res, next) {
    accountsService.getWof()
        .then(accounts => res.json(accounts))
        .catch(err => next(err))
}
function getMemberTypes(req, res, next) {
    accountsService.getMemberTypes()
        .then(membertypes => res.json(membertypes))
        .catch(err => next(err))
}
function getNewsLetterRecipientTypes(req, res, next) {
    accountsService.getNewsLetterRecipientTypes()
        .then(newsletterrecipienttypes => res.json(newsletterrecipienttypes))
        .catch(err => next(err))
}
function getMemberAdminTypes(req, res, next) {
    accountsService.getMemberAdminTypes()
        .then(memberadmintypes => res.json(memberadmintypes))
        .catch(err => next(err))
}

function deleteOne(req, res, next) {
    accountsService.deleteOne(req.params.id)
        .then(account => res.json(account))
        .catch(err => next(err))
}

function changeStatus(req, res, next) {
    accountsService.changeStatus(req.body)
        .then( account => res.json(account) )
        .catch(err => next(err))
}
