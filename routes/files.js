const app = require('express')();
const router = require('express').Router();
const aws = require('aws-sdk');
const s3 = new aws.S3();
const multer = require('multer');
const multerS3 = require('multer-s3');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'aluxion.bucket/tests',
    key: function(req, file, cb) {
      console.log(file);
      cb(null, file.originalname);
    }
  })
});

router.get('/', async (req, res) => {
  try {
    aws.config.setPromisesDependency();
    aws.config.update({
      secretAccessKey: 'cPf5pyX8m/PAcqsrw3RLs0rM1Kt67MNnOaOZDtF1',
      accessKeyId: 'AKIAY74DF3JTKB2AGMWV'
    });
    const response = await s3
      .listObjectsV2({
        Bucket: 'aluxion.bucket/tests'
      })
      .promise();
    console.log(response);
    res.render('uploadFile.ejs');
  } catch (e) {
    console.log('our error', e);
  }
});

router.post('/upload', upload.array('file', 1), (req, res, next) => {
  res.send('File uploaded!');
});

module.exports = router;
