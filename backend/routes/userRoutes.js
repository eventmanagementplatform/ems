const express = require('express');
const router = express.Router();
const {
  registerUser,
  getUsers,
  getUserByUserRegistrationId,
  deleteUser,
  updateUser,
  patchUser
} = require('../controllers/userController');
const validateRegister  = require('../middleware/validateRegister');

router.post('/register', validateRegister, registerUser);
router.get('/register', getUsers);
router.get('/register/:id', getUserByUserRegistrationId);
router.delete('/register/:id', deleteUser);
router.put('/register/:id', updateUser);
router.patch('/register/:id', patchUser);

module.exports = router;
