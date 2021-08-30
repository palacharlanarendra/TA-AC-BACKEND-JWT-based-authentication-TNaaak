var express = require('express');
var User = require('../models/UserModel');
var Book = require('../models/BooksModel');

var router = express.Router();

//get list of all comments of current book

router.get('/:id/comments', (req, res, next) => {
  let bookId = req.params.id;

  Book.findById(bookId)
    .populate('comments')
    .exec((err, book) => {
      if (err) return next(err);
      res.json({ book });
    });
});

//creating new comment

router.post('/:id/comment/new', (req, res, next) => {
  let bookId = req.params.id;
  let data = req.body;
  data.Commenter = req.user.id;
  Comment.create(data, (err, createdComment) => {
    if (err) return next(err);
    User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { comments: createdComment.id },
      },
      (err, updatedUser) => {
        res.json({ createdComment, updatedUser });
      }
    );
  });
});

//edit a comment

router.get('/:id/comment/edit/:commId', (req, res, next) => {
  let bookId = req.params.id;
  let commentId = req.params.commId;

  Comment.findById(commentId, (err, comment) => {
    if (err) return next(err);
    res.json({ comment });
  });
});

router.post('/:id/comment/edit/:commId', (req, res, next) => {
  let bookId = req.params.id;
  let commentId = req.params.commId;
  let data = req.body;

  Comment.findByIdAndUpdate(commentId, data, (err, updatedComment) => {
    if (err) return next(err);
    res.json({ updatedComment });
  });
});

//delete a comment
router.get('/:id/comment/delete/:commId', (req, res, next) => {
  let bookId = req.params.id;
  let commentId = req.params.commId;

  Comment.findByIdAndDelete(commentId, (err, deletedComment) => {
    if (err) return next(err);
    User.findByIdAndUpdate(
      deletedComment.Commenter,
      {
        $pull: { comments: deletedComment.id },
      },
      (err, updatedUser) => {
        if (err) return next(err);
        res.json({ deletedComment, updatedUser });
      }
    );
  });
});

module.exports = router;
