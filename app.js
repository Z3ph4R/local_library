require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');

// Асинхронне підключення до MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://Mykhailyuk:theeggman852005@cluster0.5e1dpjy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1); // Вийти з процесу у разі помилки
    }
};

// Викликаємо функцію підключення
connectDB();

const app = express();

// Додаємо обмеження швидкості
const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 хвилина
    max: 20,
});
app.use(limiter);

// Додаємо захист Helmet
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
        },
    })
);

// Додаємо стиснення
app.use(compression());

// Налаштування шаблонізатора PUG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Підключення статичних файлів
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Підключення маршрутів
const indexRouter = require('./routes/index');
const catalogRouter = require('./routes/catalog');
app.use('/', indexRouter);
app.use('/catalog', catalogRouter);

// Обробка помилок
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущено на порті ${PORT}`);
});