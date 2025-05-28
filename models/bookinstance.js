const mongoose = require('mongoose');
const { DateTime } = require("luxon");

const BookInstanceSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    imprint: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
        default: 'Maintenance'
    },
    due_back: { type: Date, default: Date.now }
});

// Virtual for bookinstance's URL
BookInstanceSchema.virtual('url').get(function () {
    return `/catalog/bookinstance/${this._id}`;
});

// Virtual for formatted due date (MEDIUM format - e.g. Jan 1, 2023)
BookInstanceSchema.virtual('due_back_formatted').get(function () {
    if (!this.due_back) return '';
    return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

// Virtual for formatted due date (ISO format - YYYY-MM-DD)
BookInstanceSchema.virtual('due_back_iso').get(function () {
    return this.due_back
        ? DateTime.fromJSDate(this.due_back).toISODate() // Format: YYYY-MM-DD
        : '';
});

// Virtual for form input (YYYY-MM-DD)
BookInstanceSchema.virtual('due_back_yyyy_mm_dd').get(function () {
    return this.due_back ? this.due_back.toISOString().split('T')[0] : '';
});

module.exports = mongoose.model('BookInstance', BookInstanceSchema);