var express = require('express');
var router = express.Router();
var User = require('../models/usersModel');
var auth = require('../middleware/auth');
var bcrypt = require('bcrypt');
router.use(auth.verifyToken);
//Get Current User
router.get('/', async (req, res, next) => {
  // console.log(req);
  let id = req.user.userId;
  try {
    let user = await User.findById(id);
    res.status(200).json({ user: user.displayUser(id) });
  } catch (error) {
    next(error);
  }
});

//Update User
router.put('/', async (req, res, next) => {
  let id = req.user.userId;
  try {
    user = await User.findByIdAndUpdate(id, req.body.user);
    return res.status(201).json({ user: user.displayUser(id) });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
