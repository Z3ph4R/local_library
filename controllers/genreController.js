const Genre = require("../models/genre");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Деталі жанру
exports.genre_detail = asyncHandler(async (req, res, next) => {
    const [genre, booksInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({ genre: req.params.id }, "title summary").exec(),
    ]);

    if (genre === null) {
        const err = new Error("Жанр не знайдено");
        err.status = 404;
        return next(err);
    }

    res.render("genre_detail", {
        title: "Деталі жанру",
        genre: genre,
        genre_books: booksInGenre,
    });
});

// Список жанрів
exports.genre_list = asyncHandler(async (req, res, next) => {
    const allGenres = await Genre.find().sort({ name: 1 }).exec();
    res.render("genre_list", {
        title: "Список жанрів",
        genre_list: allGenres,
    });
});

// Відображення форми створення жанру (GET)
exports.genre_create_get = (req, res, next) => {
    res.render("genre_form", { title: "Створити жанр" });
};

// Обробка створення жанру (POST)
exports.genre_create_post = [
    // Валідація та очищення поля name
    body("name", "Назва жанру повинна містити щонайменше 3 символи")
        .trim()
        .isLength({ min: 3 })
        .escape(),

    // Обробка запиту після валідації
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const genre = new Genre({ name: req.body.name });

        if (!errors.isEmpty()) {
            res.render("genre_form", {
                title: "Створити жанр",
                genre: genre,
                errors: errors.array(),
            });
            return;
        } else {
            // Перевірка на існування жанру
            const genreExists = await Genre.findOne({ name: req.body.name })
                .collation({ locale: "en", strength: 2 })
                .exec();
            if (genreExists) {
                res.redirect(genreExists.url);
            } else {
                await genre.save();
                res.redirect(genre.url);
            }
        }
    }),
];

// Форма видалення жанру (GET)
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Форма видалення жанру (GET): ${req.params.id}`);
});

// Форма видалення жанру (POST)
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Форма видалення жанру (POST): ${req.params.id}`);
});

// Форма оновлення жанру (GET)
exports.genre_update_get = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Форма оновлення жанру (GET): ${req.params.id}`);
});

// Форма оновлення жанру (POST)
exports.genre_update_post = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Форма оновлення жанру (POST): ${req.params.id}`);
});