const express = require('express');
const router = express.Router();
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const archiveService = require('./archive.service')

const { SITE_BASE_PATH, SITE_ARCHIVE_PATH } = require('config')

////////////// ROUTES //////////////////////
router.get('/', getAll);
router.get('/delete/:id', deleteOne);
router.get('/:id', getOne);
router.post('/add', addOne);
router.post('/edit', editOne);
router.post('/status', changeStatus);

//  Don't know ho to use as a service //
///////////// SET STORAGE ////////////////////
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${SITE_BASE_PATH}${SITE_ARCHIVE_PATH}`)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }

})
let upload = multer({ storage: storage })

// doc //
router.post('/doc', upload.single('file'), async (req, res, next) => {
  const file = req.file
  if (file) {
		res.send( { "archive_filepath": path.resolve(SITE_BASE_PATH, SITE_ARCHIVE_PATH, file.filename) })
	} else {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
})
// ^ Don't know ho to use as a service //

module.exports = router;

function getAll(req, res, next) {
    archiveService.getAll()
        .then(archive => res.json(archive))
        .catch(err => next(err));
}

function getOne(req, res, next) {
    archiveService.getOne(req.params.id)
        .then(archive => res.json(archive))
        .catch(err => next(err));
}

function addOne(req, res, next) {
    archiveService.addOne(req.body)
        .then(archive => res.json(archive))
        .catch(err => next(err));
}

function editOne(req, res, next) {
    archiveService.editOne(req.body)
        .then(archive => res.json(archive))
        .catch(err => next(err))
}

function changeStatus(req, res, next) {
    archiveService.changeStatus(req.body)
        .then(
            archive => res.json(archive),
        )
        .catch(err => next(err));
}

function deleteOne(req, res, next) {
    archiveService.deleteOne(req.params.id)
        .then(archive => res.json(archive))
        .catch(err => next(err));
}
