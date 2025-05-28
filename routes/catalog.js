const express = require('express');
const router = express.Router();

// Імпорт контролерів
const bookController = require('../controllers/bookController');
const authorController = require('../controllers/authorController');
const genreController = require('../controllers/genreController');
const bookInstanceController = require('../controllers/bookinstanceController');

// Форми створення
router.get('/genre/create', genreController.genre_create_get);
router.post('/genre/create', genreController.genre_create_post);
router.get('/author/create', authorController.author_create_get);
router.post('/author/create', authorController.author_create_post);
router.get('/book/create', bookController.book_create_get);
router.post('/book/create', bookController.book_create_post);
router.get('/bookinstance/create', bookInstanceController.bookinstance_create_get);
router.post('/bookinstance/create', bookInstanceController.bookinstance_create_post);

// Деталізовані маршрути
router.get('/book/:id', bookController.book_detail);
router.get('/author/:id', authorController.author_detail);
router.get('/genre/:id', genreController.genre_detail);

// Інші маршрути...
router.get('/', bookController.index);
router.get('/books', bookController.book_list);
router.get('/authors', authorController.author_list);
router.get('/genres', genreController.genre_list);
router.get('/bookinstances', bookInstanceController.bookinstance_list);

module.exports = router;