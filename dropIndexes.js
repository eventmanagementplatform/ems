const mongoose = require('mongoose');
const Organizer = require('./models/Organizer'); // adjust path

const run = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/ems'); // adjust as needed
    await Organizer.collection.dropIndex("registrationId_1");
    await Organizer.collection.dropIndex("registrationNumber_1");
    console.log("Indexes dropped.");
  } catch (err) {
    console.error("Error dropping indexes:", err.message);
  } finally {
    mongoose.disconnect();
  }
};

run();