const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    // Compare password
    const isMatch = await bcrypt.compare(password,user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, emsregistrationId: user.emsregistrationId },
      process.env.JWT_SECRET,
      //'testsecret123',
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful',user, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
