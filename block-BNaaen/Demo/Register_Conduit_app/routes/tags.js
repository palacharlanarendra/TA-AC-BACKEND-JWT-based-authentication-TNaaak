let express = require('express');
let router = express.Router();
let Article = require('../models/articleModel');
//Get Tags
router.get('/', async (req, res, next) => {
  console.log('enetered');
  try {
    let tags = await Article.find({}).distinct('tagList');
    res.status(200).json({ tags });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
