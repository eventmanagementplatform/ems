const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  /*organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organizer',
    required: true
  },*/
  eventTitle: { type: String, required: true },
  eventType: [{ type: String, required: true }],
 // imageGallery: [{ type: String }], // URLs or file paths
  price: { type: Number, required: true },
  description: { type: String, required: true },
  //emsregistrationId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
