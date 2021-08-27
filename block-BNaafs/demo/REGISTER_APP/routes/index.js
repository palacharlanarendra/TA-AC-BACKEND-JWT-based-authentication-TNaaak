var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200).send('index');
});
router.get('/dashboard', auth.verifyToken, (req, res) => {
  res.json({ access: 'protected resources' });
});
module.exports = router;
