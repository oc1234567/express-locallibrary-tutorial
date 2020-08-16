const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.genre_list = (req, res, next) => {
    Genre.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_genres) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('genre_list', { title: '种类列表', genre_list: list_genres });
    });
};

exports.genre_detail = function(req, res, next) {

    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
              .exec(callback);
        },

        genre_books: function(callback) {
          Book.find({ 'genre': req.params.id })
          .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
    });
};

exports.genre_create_get = function(req, res, next) {
    res.render('genre_form', { title: '创建种类' });
}

exports.genre_create_post = [
    body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    sanitizeBody('name').trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        let genre = new Genre({ name: req.body.name });

        if (!errors.isEmpty()) {
            res.render('genre_form', { title: '创建种类', genre: genre, errors: errors.array() });
            return;
        }else {
            Genre.findOne({ 'name': req.body.name }).exec( function(err, found_genre) {
                if (err) { return next(err); }

                if (found_genre) {
                    // Genre exists, redirect to its detail page.
                    res.redirect(found_genre.url);
                }
                else {

                    genre.save(function (err) {
                      if (err) { return next(err); }
                      // Genre saved. Redirect to genre detail page.
                      res.redirect(genre.url);
                    });
                }
            });
        }
    }
];

exports.genre_delete_get = function(req, res, next) {
    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
              .exec(callback);
        },

        genre_books: function(callback) {
          Book.find({ 'genre': req.params.id })
          .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) { // No results.
            res.redirect('/catalog/genres');
        }
        // Successful, so render
        res.render('genre_delete', { title: '删除种类', genre: results.genre, genre_books: results.genre_books } );
    });
};

exports.genre_delete_post = function(Req, res, next) {
    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
              .exec(callback);
        },

        genre_books: function(callback) {
          Book.find({ 'genre': req.params.id })
          .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre_books.length > 0) { // No results.
            res.render('genre_delete', { title: '删除种类', genre: results.genre, genre_books: results.genre_books } );
        }else {
            Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
                if (err) { return next(err); }
                res.redirect('/catalog/genres');
            })
        }
    });
};

exports.genre_update_get = function(req, res, next) {
    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id).exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) {
            let err = new Error('没有此作者');
            err.status = 404;
            return next(err);
        }
        res.render('genre_form', { title: '更新种类', genre: results.genre });
    })
};

exports.genre_update_post = [
    body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    sanitizeBody('name').trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        let genre = new Genre({ 
            name: req.body.name,
            _id: req.params.id //This is required, or a new ID will be assigned!
        });

        if (!errors.isEmpty()) {
            res.render('genre_form', { title: '更新种类', genre: genre, errors: errors.array() });
            return;
        }else {
            Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err,theGenre) {
                if (err) { return next(err); }
                   // Successful - redirect to book detail page.
                res.redirect(theGenre.url);
            });
        }
    }
];