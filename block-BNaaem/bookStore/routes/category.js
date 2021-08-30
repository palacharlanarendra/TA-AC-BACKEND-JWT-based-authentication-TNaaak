var express = require('express');
var _ = require('lodash');
var User = require('../models/UserModel');
var Book = require('../models/BooksModel');

var router = express.Router();


//list books by category

router.get('/list/by/:category', function (req, res, next) {
  let category = req.params.category;

  Book.find({ category: category }, (err, books) => {
    if (err) return next(err);

    res.json({ books });
  });
});

//count books for each category

router.get('/count/by/category', (req, res, next) => {
  //getting array of all categories

  Book.find({}, (err, books) => {
    if (err) return next(err);

    let arrOfCate = books.reduce((acc, cv) => {
      acc.push(cv.categories);
      return acc;
    }, []);

    arrOfCate = _.uniq(_.flattenDeep(arrOfCate));
    let objOfcount = {};

    arrOfCate.forEach((category) => {
      Book.find({ categories: category }, (err, foundBooks) => {
        if (err) return next(err);

        objOfcount[category] = foundBooks.length;
      });
    });

    res.json(objOfcount);
  });
});

//list of books by auther

router.get('/list/author/:id', function (req, res, next) {
  let authorId = req.params.id;

  User.findById(authorId)
    .populate('books')
    .exec((err, user) => {
      if (err) return next(err);

      res.json({ books: user.books });
    });
});

//list of all tags

router.get('/tags/tagslist', (req, res, next) => {
  Book.find({}, (err, books) => {
    if (err) return next(err);

    let arrOftags = books.reduce((acc, cv) => {
      acc.push(cv.tags);
      return acc;
    }, []);

    arrOftags = _.uniq(_.flattenDeep(arrOftags));

    res.json({ arrOftags });
  });
});

//list of tags in ascending/descending order
router.get('/tags/tagslist/:type', (req, res, next) => {
  let type = req.params.type;

  Book.find({}, (err, books) => {
    if (err) return next(err);

    let arrOftags = books.reduce((acc, cv) => {
      acc.push(cv.tags);
      return acc;
    }, []);

    arrOftags = _.uniq(_.flattenDeep(arrOftags));

    if (type === 'asc') {
      arrOftags = arrOftags.sort(function (a, b) {
        var nameA = a.toUpperCase(); // ignore upper and lowercase
        var nameB = b.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });

      return res.json({ arrOftags });
    }

    if (type === 'desc') {
      arrOftags = arrOftags.sort(function (a, b) {
        var nameA = a.toUpperCase(); // ignore upper and lowercase
        var nameB = b.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }

        // names must be equal
        return 0;
      });

      return res.json({ arrOftags });
    }
  });
});

//filter books by tags

router.get('/list/tags/:name', (req, res, next) => {
  let name = req.params.name;

  Book.find({ tags: name }, (err, books) => {
    if (err) return next(err);

    res.json({ books });
  });
});

//count of number of books of each  tags

router.get('/tags/tagslist/count', (req, res, next) => {
  Book.find({}, (err, books) => {
    if (err) return next(err);

    let arrOftags = books.reduce((acc, cv) => {
      acc.push(cv.tags);
      return acc;
    }, []);

    arrOftags = _.uniq(_.flattenDeep(arrOftags));

    let objOfcount = {};

    arrOftags.forEach((tag) => {
      Book.find({ tags: tag }, (err, booksByTags) => {
        if (err) return next(err);

        objOfcount[tag] = booksByTags.length;
      });
    });

    return res.json(objOfcount);
  });
});

module.exports = router;