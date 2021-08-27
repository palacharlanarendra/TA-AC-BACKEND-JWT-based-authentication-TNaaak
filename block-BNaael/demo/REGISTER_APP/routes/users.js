var express = require('express');
var router = express.Router();
var User = require('../model/usersModel');
var auth = require('../middlewares/auth');
router.post('/register', auth.verifyToken, async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    var token = await user.signToken();
    res.status(200).json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

router.post('/login', auth.verifyToken, async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email/password required' });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not registered' });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    var token = await user.signToken();
    console.log(token);
    res.json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
