var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/about/', function(req, res, next) {
  res.send('you are cool~')
})

router.get('/cool/', function(req, res, next) {
  res.send('you are so cool~')
})

router.get('/detail/', function(req, res, next) {
  res.send('this is the detail~')
})

module.exports = router;
