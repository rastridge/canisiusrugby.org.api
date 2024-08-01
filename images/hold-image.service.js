const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");
const { DB } = require('config');

const {
  siteUrl,
  siteContentPath,
  wofPath
} = config;

const contentRootPath = siteContentPath;
const BASE_URL = siteUrl;
const FILE_PATH = contentRootPath;
const TEMP_DIR = "/uploads";
const NEWS_NEWSLETTER_IMAGE_DIR = "news_newsletter_images";
// const WOF_IMAGE_DIR = '_mugs'
//// ???

module.exports = {
  setWofImage,
  setClubImage,
  setNewsImage,
};

async function setWofImage() {
  ///////////// SET STORAGE ////////////////////
  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${FILE_PATH}${wofPath}`);
      // cb(null, `${FILE_PATH}`)
    },
    filename: function (req, file, cb) {
      let y = new Date().getFullYear();
      // let y = new Date().format('YYYY-MMM-DD')
      //let n = Math.random()*10000000000000000000
      let n = "wof";
      cb(null, y + "-" + n + "-" + file.originalname);
      // cb(null, file.originalname)
    },
  });
  let upload = multer({ storage: storage });

  router.post("/wof-image", upload.single("file"), async (req, res, next) => {
    const file = req.file;
    if (file) {
      const lastDot = file.filename.lastIndexOf(".");
      const fileName = file.filename.substring(0, lastDot);
      const ext = file.filename.substring(lastDot + 1);
      const newfilename = fileName + "_72x72." + ext;
      Jimp.read(file.path)
        .then((lenna) => {
          res.send({ imageUrl: `/_img/_mugs/${newfilename}` });
          return lenna
            .resize(72, 72)
            .quality(90)
            .write(`${FILE_PATH}${wofPath}/${newfilename}`);
        }, fs.unlinkSync(file.path))
        .catch((err) => {
          console.kog(err);
        });
    } else {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
  });
}

async function setClubImage() {
  console.log("got here1 image service setClubiamge");
  ///////////// SET STORAGE ////////////////////
  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${FILE_PATH}${wofPath}`);
      // cb(null, `${FILE_PATH}`)
    },
    filename: function (req, file, cb) {
      let y = new Date().getFullYear();
      // let y = new Date().format('YYYY-MMM-DD')
      //let n = Math.random()*10000000000000000000
      let n = "wof";
      cb(null, y + "-" + n + "-" + file.originalname);
      // cb(null, file.originalname)
    },
  });
  console.log("got here2 image service storage", storage.storage);

  let upload = multer({ storage: storage });

  // clubhouse image
  router.post(
    "/clubhouse-image",
    upload.single("file"),
    async (req, res, next) => {
      console.log("got here3 image service post", req.file);
      const file = req.file;
      if (file) {
        const lastDot = file.filename.lastIndexOf(".");
        const fileName = file.filename.substring(0, lastDot);
        const ext = file.filename.substring(lastDot + 1);
        const newfilename = fileName + "_480x480." + ext;
        Jimp.read(file.path)
          .then((lenna) => {
            res.send({ imageUrl: `/_img/_mugs/${newfilename}` });
            return lenna
              .resize(480, 480)
              .quality(90)
              .write(`${FILE_PATH}${wofPath}/${newfilename}`);
          }, fs.unlinkSync(file.path))
          .catch((err) => {
            console.kog(err);
          });
      } else {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
      }
    }
  );
}

async function setNewsImage() {
  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${FILE_PATH}${wofPath}`);
      // cb(null, `${FILE_PATH}`)
    },
    filename: function (req, file, cb) {
      let y = new Date().getFullYear();
      // let y = new Date().format('YYYY-MMM-DD')
      //let n = Math.random()*10000000000000000000
      let n = "wof";
      cb(null, y + "-" + n + "-" + file.originalname);
      // cb(null, file.originalname)
    },
  });
  let upload = multer({ storage: storage });

  router.post("/", upload.single("file"), async (req, res, next) => {
    const file = req.file;
    if (file) {
      await sharp(file.path)
        .resize(640)
        .jpeg({ quality: 90 })
        .toFile(
          path.resolve(
            file.destination,
            NEWS_NEWSLETTER_IMAGE_DIR,
            file.filename
          )
        );
      fs.unlinkSync(file.path);
      // must be full BASE_URL when embedded in email
      res.send({
        imageUrl: `${BASE_URL}${TEMP_DIR}/${NEWS_NEWSLETTER_IMAGE_DIR}/${file.filename}`,
      });
    } else {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
  });
}
