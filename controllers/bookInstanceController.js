const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const async = require('async');

exports.bookinstance_list = (req, res, next) => {
    BookInstance.find().populate('book').exec(function (err, list_bookinstances) {
        if (err) {
            return next(err);
        }
        res.render('bookinstance_list', {title: '书籍列表', bookinstance_list: list_bookinstances});
    })
};

exports.bookinstance_detail = function(req, res, next) {
    BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
      if (err) { return next(err); }
      if (bookinstance==null) { // No results.
          var err = new Error('Book copy not found');
          err.status = 404;
          return next(err);
      }
      // Successful, so render.
      res.render('bookinstance_detail', { title: '书籍：', bookinstance:  bookinstance});
    })
};

exports.bookinstance_create_get = function(req, res, next) {       
    Book.find({},'title')
    .exec(function (err, books) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('bookinstance_form', {title: '创建书籍', book_list: books});
    });
};

exports.bookinstance_create_post = [

    // Validate fields.
    body('book', '必须指定一本书籍').isLength({ min: 1 }).trim(),
    body('imprint', '必须填写出版信息').isLength({ min: 1 }).trim(),
    body('due_back', '归还日期必须是有效日期').optional({ checkFalsy: true }).isISO8601(),
    
    // Sanitize fields.
    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var bookinstance = new BookInstance(
          { book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Book.find({},'title')
                .exec(function (err, books) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('bookinstance_form', { title: '创建书籍', book_list : books, selected_book : bookinstance.book._id , errors: errors.array(), bookinstance:bookinstance });
            });
            return;
        }
        else {
            // Data from form is valid.
            bookinstance.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                res.redirect(bookinstance.url);
            });
        }
    }
];

exports.bookinstance_delete_get = function(req, res, next) {
    BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
      if (err) { return next(err); }
      if (bookinstance==null) { // No results.
          var err = new Error('Book copy not found');
          err.status = 404;
          return next(err);
      }
      // Successful, so render.
      res.render('bookinstance_delete', { title: '书籍:', bookinstance:  bookinstance});
    })
};

exports.bookinstance_delete_post = function(req, res, next) {
    BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
      if (err) { return next(err); }
      if (bookinstance==null) { // No results.
          var err = new Error('Book copy not found');
          err.status = 404;
          return next(err);
      }
      BookInstance.findByIdAndRemove(req.body.bookinstanceid, function deleteBookInstance(err) {
        if (err) { return next(err); }
        res.redirect('/catalog/bookinstances');
      })
    })
};

exports.bookinstance_update_get = function(req, res, next) {
    async.parallel({
        books: function(callback) {
            Book.find({}, 'title').exec(callback);
        },
        bookinstance: function(callback) {
            BookInstance.findById(req.params.id).populate('book').exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        // Successful, so render.
        res.render('bookinstance_form', {title: '更新书籍', book_list: results.books, bookinstance: results.bookinstance});
    })
};

exports.bookinstance_update_post = [

    // Validate fields.
    body('book', '必须指定一本书籍').isLength({ min: 1 }).trim(),
    body('imprint', '必须填写出版信息').isLength({ min: 1 }).trim(),
    body('due_back', '归还日期必须是有效日期').optional({ checkFalsy: true }).isISO8601(),
    
    // Sanitize fields.
    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var bookinstance = new BookInstance(
          { book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
            _id: req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Book.find({},'title')
                .exec(function (err, books) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('bookinstance_form', { title: '创建书籍', book_list : books, selected_book : bookinstance.book._id , errors: errors.array(), bookinstance:bookinstance });
            });
            return;
        }
        else {
            // Data from form is valid.
            BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function (err,theBookInstance) {
                if (err) { return next(err); }
                   // Successful - redirect to book detail page.
                res.redirect(theBookInstance.url);
            });
        }
    }
];