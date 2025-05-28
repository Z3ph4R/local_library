const Author = require("../models/author");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Деталі автора
exports.author_detail = asyncHandler(async (req, res, next) => {
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    const err = new Error("Автора не знайдено");
    err.status = 404;
    return next(err);
  }

  res.render("author_detail", {
    title: "Деталі автора",
    author: author,
    author_books: allBooksByAuthor,
  });
});

// Список авторів
exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ family_name: 1 }).exec();
  res.render("author_list", {
    title: "Список авторів",
    author_list: allAuthors,
  });
});

// Відображення форми створення автора (GET)
exports.author_create_get = (req, res, next) => {
  res.render("author_form", { title: "Створити автора" });
};

// Обробка створення автора (POST)
exports.author_create_post = [
  // Валідація та очищення полів
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Ім'я повинно бути вказано.")
    .isAlphanumeric()
    .withMessage("Ім'я містить неалфавітні символи."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Прізвище повинно бути вказано.")
    .isAlphanumeric()
    .withMessage("Прізвище містить неалфавітні символи."),
  body("date_of_birth", "Недійсна дата народження")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Недійсна дата смерті")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Обробка запиту
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    if (!errors.isEmpty()) {
      res.render("author_form", {
        title: "Створити автора",
        author: author,
        errors: errors.array(),
      });
      return;
    } else {
      await author.save();
      res.redirect(author.url);
    }
  }),
];

// Форма видалення автора (GET)
exports.author_delete_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Форма видалення автора (GET): ${req.params.id}`);
});

// Форма видалення автора (POST)
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Форма видалення автора (POST): ${req.params.id}`);
});

// Форма оновлення автора (GET)
exports.author_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Форма оновлення автора (GET): ${req.params.id}`);
});

// Форма оновлення автора (POST)
exports.author_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Форма оновлення автора (POST): ${req.params.id}`);
});