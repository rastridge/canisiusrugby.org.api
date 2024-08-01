const express = require('express')
const router = express.Router()
const userService = require('./users.service')

////////////// ROUTES //////////////////////
router.post('/authenticate', authenticate)
//router.post('/updatejwtoken', updateJWToken)
router.post('/status', changeStatus);
router.post('/add', addOne);
router.post('/edit', editOne);
router.post('/resetrequest', resetRequest);
router.post('/resetpassword', resetPassword);
router.post('/perms', getAppPerms);
router.get('/apps', getApps);
router.get('/:id', getOne);
router.get('/delete/:id', deleteOne);
router.get('/', getAll);

module.exports = router;


function authenticate(req, res, next) {
		userService.authenticate(req.body)
		.then(user => {
			user ? res.json(user) : res.status(404).json({ message: 'Login failed' })
		})
		.catch(err => next(err));
	}

/*
function updateJWToken(req, res, next) {
    userService.updateJWToken(req.body)
        .then(user => res.json(user))
        .catch(err => next(err))
}
*/

function resetRequest(req, res, next) {
	userService.resetRequest(req.body)
			.then(username => res.json(username))
			.catch(err => next(err))
}

function resetPassword(req, res, next) {
	userService.resetPassword(req.body)
			.then(username => res.json(username))
			.catch(err => next(err))
}

function addOne(req, res, next) {
    userService.addOne(req.body)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function editOne(req, res, next) {
    userService.editOne(req.body)
        .then(user => res.json(user))
        .catch(err => next(err))
}
function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getOne(req, res, next) {
    userService.getOne(req.params.id)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function deleteOne(req, res, next) {
    userService.deleteOne(req.params.id)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function changeStatus(req, res, next) {
    userService.changeStatus(req.body)
        .then(
            user => res.json(user),
        )
        .catch(err => next(err));
}

function getApps(req, res, next) {
    userService.getApps()
        .then(apps => res.json(apps))
        .catch(err => next(err));
}

function getAppPerms(req, res, next) {
    userService.getAppPerms(req.body)
        .then(perm => res.json(perm))
        .catch(err => next(err));
}
