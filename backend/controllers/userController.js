const User = require('../models/User');
const bcrypt = require('bcrypt');
const Counter = require('../models/Counter');

const generateRegistrationId = async () => {
  const currentYear = new Date().getFullYear();
  const counter = await Counter.findOneAndUpdate(
    { name: `user-${currentYear}` },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  const number = counter.value.toString().padStart(5, '0');
  return `EMS-U-${currentYear}-${number}`;
};

exports.registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, mobile, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const emsuserregistrationId = await generateRegistrationId();

    const newUser = new User({
      emsuserregistrationId,
      firstname,
      lastname,
      email,
      mobile,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User signup successfully', newUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

exports.getUserByUserRegistrationId = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ emsuserregistrationId: id }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check for duplicate email (exclude current user)
    if (updates.email) {
      const existingUser = await User.findOne({ email: updates.email });
      if (existingUser && existingUser.emsuserregistrationId !== id) {
        return res.status(409).json({ message: 'Email already in use by another user' });
      }
    }

    const user = await User.findOneAndUpdate(
      { emsuserregistrationId: id },
      updates,
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Update error', error: err.message });
  }
};
exports.patchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const patchFields = req.body;

    // Check for duplicate email (exclude current user)
    if (patchFields.email) {
      const existingUser = await User.findOne({ email: patchFields.email });
      if (existingUser && existingUser.emsuserregistrationId !== id) {
        return res.status(409).json({ message: 'Email already in use by another user' });
      }
    }

    const user = await User.findOneAndUpdate(
      { emsuserregistrationId: id },
      { $set: patchFields },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User patched successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Patch error', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findOneAndDelete({ emsuserregistrationId: id });
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete error', error: err.message });
  }
};
