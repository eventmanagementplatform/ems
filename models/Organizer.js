const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
  emsregistrationId: {
    type: String,
    unique: true,
    required: true
  },
  companyName: { type: String, required: true },
  isCompanyRegistered: { type: Boolean, required: true },
  companyRegistrationNumber: { type: String, unique: true, sparse: true, default: '' },
  logo: { type: String },
  netWorth: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  website: { type: String },
  address: { type: String, required: true },
  noOfEmployees: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Organizer', organizerSchema);
