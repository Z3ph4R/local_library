﻿const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Деталі книги
exports.book_detail = asyncHandler(async (req, res, next) => {
    const [book, bookInstances] = await Promise.all([
        Book.findById(req.params.id).populate("author").populate("genre").exec(),
        BookInstance.find({ book: req.params.id }).exec(),
    ]);

    if (book === null) {
        const err = new Error("Книгу не знайдено");
        err.status = 404;
        return next(err);
    }

    res.render("book_detail", {
        title: book.title,
        book: book,
        book_instances: bookInstances,
    });
});

// Список книг
exports.book_list = asyncHandler(async (req, res, next) => {
    const allBooks = await Book.find({}, "title author")
        .sort({ title: 1 })
        .populate("author")
        .exec();

    res.render("book_list", {
        title: "Список книг",
        book_list: allBooks,
    });
});

// Головна сторінка
exports.index = asyncHandler(async (req, res, next) => {
    const [
        numBooks,
        numBookInstances,
        numAvailableBookInstances,
        numAuthors,
        numGenres,
    ] = await Promise.all([
        Book.countDocuments({}).exec(),
        BookInstance.countDocuments({}).exec(),
        BookInstance.countDocuments({ status: "Available" }).exec(),
        Author.countDocuments({}).exec(),
        Genre.countDocuments({}).exec(),
    ]);

    res.render("index", {
        title: "Головна сторінка Місцевої бібліотеки",
        book_count: numBooks,
        book_instance_count: numBookInstances,
        book_instance_available_count: numAvailableBookInstances,
        author_count: numAuthors,
        genre_count: numGenres,
    });
});

// Відображення форми створення книги (GET)
exports.book_create_get = asyncHandler(async (req, res, next) => {
    const [allAuthors, allGenres] = await Promise.all([
        Author.find().sort({ family_name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
    ]);

    res.render("book_form", {
        title: "Створити книгу",
        authors: allAuthors,
        genres: allGenres,
    });
});

// Обробка створення книги (POST)
exports.book_create_post = [
    // Перетворення жанру на масив
    (req, res, next) => {
        if (!Array.isArray(req.body.genre)) {
            req.body.genre = typeof req.body.genre === "undefined" ? [] : [req.body.genre];
        }
        next();
    },

    // Валідація та очищення полів
    body("title", "Назва не повинна бути порожньою")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("author", "Автор не повинен бути порожнім")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("summary", "Опис не повинен бути порожнім")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("isbn", "ISBN не повинен бути порожнім")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("genre.*").escape(),

    // Обробка запиту
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre,
        });

        if (!errors.isEmpty()) {
            const [allAuthors, allGenres] = await Promise.all([
                Author.find().sort({ family_name: 1 }).exec(),
                Genre.find().sort({ name: 1 }).exec(),
            ]);

            // Позначення вибраних жанрів
            for (const genre of allGenres) {
                if (book.genre.includes(genre._id)) {
                    genre.checked = "true";
                }
            }

            res.render("book_form", {
                title: "Створити книгу",
                authors: allAuthors,
                genres: allGenres,
                book: book,
                errors: errors.array(),
            });
        } else {
            await book.save();
            res.redirect(book.url);
        }
    }),
];

// Інші методи контролера...
exports.author_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Список авторів");
});

exports.genre_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Список жанрів");
});

exports.bookinstance_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Список примірників книг");
});

exports.book_delete_get = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Форма видалення книги (GET): ${req.params.id}`);
});

exports.book_delete_post = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Форма видалення книги (POST): ${req.params.id}`);
});

exports.book_update_get = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Форма оновлення книги (GET): ${req.params.id}`);
});

exports.book_update_post = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Форма оновлення книги (POST): ${req.params.id}`);
});