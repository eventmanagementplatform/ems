const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  emsuserregistrationId: { type: String, unique: true, required: true },
  firstname: String,
  lastname: String,
  email: { type: String, unique: true, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
