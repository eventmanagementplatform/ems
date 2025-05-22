const Event = require('../models/Event');

exports.addEvent = async (req, res) => {
  try {
    const { eventTitle, eventType, price, description } = req.body;

    //const organizerId = req.user.id; // Set by auth middleware
 /*const emsregistrationId = req.user?.emsregistrationId;
 
 console.log(emsregistrationId);

    if (!emsregistrationId) {
      return res.status(401).json({ message: 'Unauthorized: Missing emsregistrationId' });
    }*/

    const newEvent = new Event({
      //organizerId,
      eventTitle,
      eventType,
      //imageGallery,
      price,
      description,
     // emsregistrationId
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event added successfully', event: newEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error adding event', error: error.message });
  }
};
