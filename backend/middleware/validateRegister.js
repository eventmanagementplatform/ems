const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('firstname').notEmpty().withMessage('First Name is required'),
  body('lastname').notEmpty().withMessage('Last Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('mobile').matches(/^[0-9]{10}$/).withMessage('Mobile must be 10 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  }
];
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = validateRegister;
