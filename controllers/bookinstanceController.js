const BookInstance = require("../models/bookinstance");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Список екземплярів книг
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
    const allBookInstances = await BookInstance.find({})
        .populate("book")
        .exec();

    res.render("bookinstance_list", {
        title: "Список екземплярів книг",
        bookinstance_list: allBookInstances
    });
});

// Відображення форми створення екземпляру книги (GET)
exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
    const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

    res.render("bookinstance_form", {
        title: "Створити екземпляр книги",
        book_list: allBooks,
    });
});

// Обробка створення екземпляру книги (POST)
exports.bookinstance_create_post = [
    // Валідація та очищення полів
    body("book", "Книга повинна бути вказана")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("imprint", "Видавництво повинно бути вказане")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("status").escape(),
    body("due_back", "Невірний формат дати")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),

    // Обробка запиту
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const bookInstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
        });

        if (!errors.isEmpty()) {
            const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

            res.render("bookinstance_form", {
                title: "Створити екземпляр книги",
                book_list: allBooks,
                selected_book: bookInstance.book._id,
                bookinstance: bookInstance,
                errors: errors.array(),
            });
            return;
        } else {
            await bookInstance.save();
            res.redirect(bookInstance.url);
        }
    }),
];