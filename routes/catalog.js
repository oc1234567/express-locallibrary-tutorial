const express = require('express');
const bookControllers = require('../controllers/bookController');
const bookInstanceControllers = require('../controllers/bookInstanceController');
const authorControllers = require('../controllers/authorController');
const genreControllers = require('../controllers/genreController');

const router = express.Router();

//Book
router.get('/', bookControllers.index);
router.get('/books', bookControllers.book_list);
router.get('/book/create', bookControllers.book_create_get);
router.post('/book/create', bookControllers.book_create_post);
router.get('/book/:id', bookControllers.book_detail);
router.get('/book/:id/delete', bookControllers.book_delete_get);
router.post('/book/:id/delete', bookControllers.book_delete_post);
router.get('/book/:id/update', bookControllers.book_update_get);
router.post('/book/:id/update', bookControllers.book_update_post);

//Author
router.get('/authors', authorControllers.author_list);
router.get('/author/create', authorControllers.author_create_get);
router.post('/author/create', authorControllers.author_create_post);
router.get('/author/:id', authorControllers.author_detail);
router.get('/author/:id/delete', authorControllers.author_delete_get);
router.post('/author/:id/delete', authorControllers.author_delete_post);
router.get('/author/:id/update', authorControllers.author_update_get);
router.post('/author/:id/update', authorControllers.author_update_post);


//Genre
router.get('/genres', genreControllers.genre_list);
router.get('/genre/create', genreControllers.genre_create_get);
router.post('/genre/create', genreControllers.genre_create_post);
router.get('/genre/:id', genreControllers.genre_detail);
router.get('/genre/:id/delete', genreControllers.genre_delete_get);
router.post('/genre/:id/delete', genreControllers.genre_delete_post);
router.get('/genre/:id/update', genreControllers.genre_update_get);
router.post('/genre/:id/update', genreControllers.genre_update_post);


//BookInstance
router.get('/bookinstances', bookInstanceControllers.bookinstance_list);
router.get('/bookinstance/create', bookInstanceControllers.bookinstance_create_get);
router.post('/bookinstance/create', bookInstanceControllers.bookinstance_create_post);
router.get('/bookinstance/:id', bookInstanceControllers.bookinstance_detail);
router.get('/bookinstance/:id/delete', bookInstanceControllers.bookinstance_delete_get);
router.post('/bookinstance/:id/delete', bookInstanceControllers.bookinstance_delete_post);
router.get('/bookinstance/:id/update', bookInstanceControllers.bookinstance_update_get);
router.post('/bookinstance/:id/update', bookInstanceControllers.bookinstance_update_post);


module.exports = router;