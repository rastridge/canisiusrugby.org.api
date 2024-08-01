const express = require('express')
const router = express.Router()
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const activityLog = require('_helpers/activity-log')

const { SITE_URL, SITE_BASE_PATH, TEMP_DIR, NEWS_NEWSLETTERS, WOF, CLUBHOUSE, SPONSORS } = require('config')

// activityLog('image-controller', 'config====', SITE_URL + ' ' + SITE_BASE_PATH + ' ' + TEMP_DIR + ' ' + NEWS_NEWSLETTERS + ' ' + WOF + ' ' + CLUBHOUSE + ' ' + SPONSORS )

function newFilename (fn, sz) {
  return fn.substring(0, fn.lastIndexOf('.')) + '_' + sz + '.' + fn.substring(fn.lastIndexOf('.') + 1)
}

///////////// SET STORAGE ////////////////////
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${SITE_BASE_PATH}${TEMP_DIR}`)
  },
  filename: function (req, file, cb) {
    let n = Math.random()*10000000000000000000
    cb(null, n + '-'+ file.originalname)
  }

})
let upload = multer({ storage: storage })

////////////// ROUTES //////////////////////

// wof images //
router.post('/wof-image', upload.single('file'), async (req, res, next) => {
  const file = req.file
  if (file) {
    const newfilename = newFilename(file.filename, '72')
		await sharp(file.path)
		.resize(72)
    .toFile(
      `${SITE_BASE_PATH}${WOF}/${newfilename}`
      )
      fs.unlinkSync(file.path)
      res.send( { "imageUrl": path.resolve(SITE_URL, WOF, newfilename) })
  } else {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
})

// sponsors images //
router.post('/ad-image', upload.single('file'), async (req, res, next) => {
  const file = req.file
  if (file) {
    const newfilename = newFilename(file.filename, '750x125')
    await sharp(file.path)
    .resize(750,125)
    .jpeg({quality: 90})
    .toFile(
      `${SITE_BASE_PATH}${SPONSORS}/${newfilename}`
      )
      fs.unlinkSync(file.path)
      // must be full BASE_URL when embedded in email
      res.send( { "imageUrl": path.resolve(SITE_URL, SPONSORS, newfilename) })
  } else {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
})

// clubhouse images //
router.post('/clubhouse-image', upload.single('file'), async (req, res, next) => {
  const file = req.file
  if (file) {
    const newfilename = newFilename(file.filename, '480')
    await sharp(file.path)
    .resize(480)
    .toFormat('png')
    .toFile(
      `${SITE_BASE_PATH}${CLUBHOUSE}/${newfilename}`
      )
      fs.unlinkSync(file.path)
      // must be full BASE_URL when embedded in email
      res.send( { "imageUrl": path.resolve(SITE_URL, CLUBHOUSE, newfilename) })
  } else {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
})


// news and newsletters //
router.post('/news-newsletters', upload.single('file'), async (req, res, next) => {
  const file = req.file
  if (file) {
    const newfilename = newFilename(file.filename, '640')
    await sharp(file.path)
    .resize(640)
    .jpeg({quality: 90})
    .toFile(
      `${SITE_BASE_PATH}${NEWS_NEWSLETTERS}/${newfilename}`
      )
      fs.unlinkSync(file.path)
      // must be full BASE_URL when embedded in email
      res.send( { "imageUrl": `${SITE_URL}${NEWS_NEWSLETTERS}/${newfilename}`})
  } else {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
})


module.exports = router
