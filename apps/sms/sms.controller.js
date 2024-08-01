const express = require('express');
const router = express.Router();
const smsService = require('./sms.service');

////////////// ROUTES //////////////////////

router.get('/', getAll)
router.post('/add', addOne)
router.post('/edit', editOne)
router.post('/send', sendSMS)
router.post('/MessageStatus', messageStatus)
router.get('/membertypes', getMemberTypes)
router.get('/delete/:id', deleteOne)
router.get('/:id', getOne)
router.post('/status', changeStatus)

module.exports = router;

function messageStatus(req, res, next) {
	smsService.messageStatus(req.body)
			.then(sms => res.json(sms))
			.catch(err => next(err))
}

function addOne(req, res, next) {
    smsService.addOne(req.body)
        .then(sms => res.json(sms))
        .catch(err => next(err))
}

function editOne(req, res, next) {
    smsService.editOne(req.body)
        .then(sms => res.json(sms))
        .catch(err => next(err))
}

function sendSMS(req, res, next) {
	smsService.sendSMS(req.body)
			.then(sms => res.json(sms))
			.catch(err => next(err))
}

function getAll(req, res, next) {
    smsService.getAll()
        .then(sms => res.json(sms))
        .catch(err => next(err))
}
function getMemberTypes(req, res, next) {
    smsService.getMemberTypes()
        .then(membertypes => res.json(membertypes))
        .catch(err => next(err))
}
function getOne(req, res, next) {
    smsService.getOne(req.params.id)
        .then(sms => res.json(sms))
        .catch(err => next(err))
}
function deleteOne(req, res, next) {
    smsService.deleteOne(req.params.id)
        .then(sms => res.json(sms))
        .catch(err => next(err))
}
function changeStatus(req, res, next) {
    smsService.changeStatus(req.body)
        .then( sms => res.json(sms) )
        .catch(err => next(err))
}
