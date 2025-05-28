const mongoose = require('mongoose');
const { DateTime } = require("luxon"); // Додано імпорт Luxon

const AuthorSchema = new mongoose.Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Стара віртуальна властивість для імені (без змін)
AuthorSchema.virtual('name').get(function() {
  return `${this.family_name}, ${this.first_name}`;
});

// Стара віртуальна властивість для URL (без змін)
AuthorSchema.virtual('url').get(function() {
  return `/catalog/author/${this._id}`;
});

// Нова віртуальна властивість для періоду життя (додано)
AuthorSchema.virtual('lifespan').get(function() {
  const birth = this.date_of_birth ? 
    DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
  const death = this.date_of_death ? 
    DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : '';
  return `${birth} - ${death}`;
});

// Старий метод для форматування дат (як було раніше)
AuthorSchema.virtual('date_of_birth_yyyy_mm_dd').get(function() {
  return this.date_of_birth ? this.date_of_birth.toISOString().split('T')[0] : '';
});

AuthorSchema.virtual('date_of_death_yyyy_mm_dd').get(function() {
  return this.date_of_death ? this.date_of_death.toISOString().split('T')[0] : '';
});

module.exports = mongoose.model('Author', AuthorSchema);