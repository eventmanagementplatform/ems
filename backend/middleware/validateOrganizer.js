const { body, validationResult } = require('express-validator');

const validateOrganizer = [
  body('companyName').notEmpty().withMessage('Company name is required'),

  body('isRegistered')
    .toBoolean() // convert string to boolean
    .isBoolean()
    .withMessage('isRegistered must be true or false'),

  body('registrationNumber')
    .custom((value, { req }) => {
      if (req.body.isRegistered === true && (!value || value.trim() === '')) {
        throw new Error('Registration number is required if company is registered');
      }
      return true;
    }),

  body('netWorth').notEmpty().withMessage('Net worth is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('address').notEmpty().withMessage('Address is required'),
  body('noOfEmployees').isInt({ min: 1 }).withMessage('No of employees must be a number'),

  // Optional: If logo validation is needed, add here (requires multer or custom check)

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  },
];

module.exports = validateOrganizer;
