const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Organizer = require('../models/Organizer');
dotenv.config();

exports.orgloginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const organizer = await Organizer.findOne({ email });
    if (!organizer) return res.status(401).json({ message: 'Invalid email or password' });

    // Compare password
    //const isMatch = await User.findOne({password});
    const isMatch = await bcrypt.compare(password,organizer.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    // Generate JWT Token
    const token = jwt.sign(
      { id: organizer.emsregistrationId, email: organizer.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful',organizer, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
