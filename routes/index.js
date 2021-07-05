var express = require('express');
var router = express.Router();

const csvUploader = require('./../helpres/uploadExcel');
const selaController = require('./../controller/selaController');

/* Check ping of user route */
router.get('/ping', function (req, res) {
  res.status(200).json({ success: true });
});

router.post('/data/upload', csvUploader.uploadCsv, csvUploader.dataStorage);

router.post('/search', selaController.search);

router.get('/download/:fileName', selaController.download);

module.exports = router;
