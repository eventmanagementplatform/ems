const Organizer = require('../models/Organizer');
const bcrypt = require('bcrypt');
const Counter = require('../models/Counter');

const generateRegistrationId = async () => {
  const currentYear = new Date().getFullYear();

  const counter = await Counter.findOneAndUpdate(
    { name: `organizer-${currentYear}` },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  const number = counter.value.toString().padStart(5, '0');
  return `EMS-O-${currentYear}-${number}`;
};
exports.createOrganizer = async (req, res) => {
  try {
    const {
      companyName,
      //isCompanyRegistered,
      //companyRegistrationNumber,
      netWorth,
      description,
      email,
      password,
      website,
      address,
      noOfEmployees
    } = req.body;

    // Check if email already exists
    const emailExists = await Organizer.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // If registered, check companyRegistrationNumber uniqueness
    /*if (isCompanyRegistered && companyRegistrationNumber) {
      const regNumExists = await Organizer.findOne({ companyRegistrationNumber });
      if (regNumExists) {
        return res.status(409).json({ message: 'Registration number already exists' });
      }
    }*/

    const logo = req.file ? req.file.path : null;
    const hashedPassword = await bcrypt.hash(password, 10);
    const emsregistrationId = await generateRegistrationId();
    const organizer = new Organizer({
      emsregistrationId,
      companyName,
      //isCompanyRegistered,
      //companyRegistrationNumber: isCompanyRegistered ? companyRegistrationNumber : '',
      logo,
      netWorth,
      description,
      email,
      password: hashedPassword,
      website,
      address,
      noOfEmployees,
      //...(isCompanyRegistered && companyRegistrationNumber ? { companyRegistrationNumber } : {})
    });
    /*if (isCompanyRegistered && companyRegistrationNumber) {
    organizer.companyRegistrationNumber = companyRegistrationNumber;
    }*/

    await organizer.save();
    res.status(201).json({ message: 'Organizer onboarded successfully', organizer });
  } catch (err) {
    res.status(500).json({ message: 'Error creating organizer', error: err.message });
  }
};

exports.getOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find();
    res.status(200).json(organizers);
  } catch (err) {
    res.status(500).json({ message: 'Fetch error', error: err.message });
  }
};

exports.getOrganizerById = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id);
    if (!organizer) return res.status(404).json({ message: 'Organizer not found' });
    res.status(200).json(organizer);
  } catch (err) {
    res.status(500).json({ message: 'Fetch error', error: err.message });
  }
};

exports.updateOrganizer = async (req, res) => {
  try {
    const {
      companyName,
      //isCompanyRegistered,
      //companyRegistrationNumber,
      netWorth,
      description,
      email,
      website,
      address,
      noOfEmployees
    } = req.body;

    // Check if email exists in other organizer
    const emailExists = await Organizer.findOne({ email, _id: { $ne: req.params.id } });
    if (emailExists) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // If registered, check registration number uniqueness in others
    if (isCompanyRegistered && companyRegistrationNumber) {
      const regNumExists = await Organizer.findOne({
        companyRegistrationNumber,
        _id: { $ne: req.params.id }
      });
      if (regNumExists) {
        return res.status(409).json({ message: 'Registration number already exists' });
      }
    }

    const updatedData = {
      companyName,
      isCompanyRegistered,
      companyRegistrationNumber: isCompanyRegistered ? companyRegistrationNumber : '',
      netWorth,
      description,
      email,
      website,
      address,
      noOfEmployees
    };

    if (req.file) {
      updatedData.logo = req.file.path;
    }

    const organizer = await Organizer.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!organizer) return res.status(404).json({ message: 'Organizer not found' });

    res.status(200).json({ message: 'Organizer updated', organizer });
  } catch (err) {
    res.status(500).json({ message: 'Update error', error: err.message });
  }
};

exports.deleteOrganizer = async (req, res) => {
  try {
    const result = await Organizer.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Organizer not found' });
    res.status(200).json({ message: 'Organizer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete error', error: err.message });
  }
};
// using registrationId
exports.deleteOrganizerByRegistrationId = async (req, res) => {
  try {
    const { emsregistrationId } = req.params;

    const result = await Organizer.findOneAndDelete({ emsregistrationId });

    if (!result) {
      return res.status(404).json({ message: 'Organizer not found with this emsregistrationId' });
    }

    res.status(200).json({ message: 'Organizer deleted successfully'});
  } catch (err) {
    res.status(500).json({ message: 'Delete error', error: err.message });
  }
};

exports.updateOrganizerByRegistrationId = async (req, res) => {
  try {
    const { emsregistrationId } = req.params;

    const {
      companyName,
      isCompanyRegistered,
      netWorth,
      description,
      email,
      website,
      address,
      noOfEmployees,
      mobileNumber,
      companyRegistrationNumber // optional if isCompanyRegistered is false
    } = req.body;

    const updateData = {
      companyName,
      isCompanyRegistered,
      netWorth,
      description,
      email,
      website,
      address,
      noOfEmployees,
      mobileNumber
    };

    // If isCompanyRegistered is true, companyRegistrationNumber must be provided
    if (isCompanyRegistered === true || isCompanyRegistered === 'true') {
      if (!companyRegistrationNumber) {
        return res.status(400).json({ message: 'Registration number is required when isCompanyRegistered is true' });
      }
      updateData.companyRegistrationNumber = companyRegistrationNumber;
    }

    // Optional file upload (e.g., logo)
    if (req.file) {
      updateData.logo = req.file.path;
    }

    const organizer = await Organizer.findOneAndUpdate(
      { emsregistrationId },
      updateData,
      { new: true }
    );

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found with this emsregistrationId' });
    }

    res.status(200).json({ message: 'Organizer updated successfully', organizer });
  } catch (err) {
    res.status(500).json({ message: 'Update error', error: err.message });
  }
};
exports.patchOrganizerByRegistrationId = async (req, res) => {
  try {
    const { emsregistrationId } = req.params;

    const updates = req.body;

    // Optional: If a file (logo) is uploaded
    if (req.file) {
      updates.logo = req.file.path;
    }

    // If `isCompanyRegistered` is being updated to false, remove the registration number
    if (updates.isCompanyRegistered === false) {
      updates.companyRegistrationNumber = '';
    }

    const updatedOrganizer = await Organizer.findOneAndUpdate(
      { emsregistrationId },
      updates,
      { new: true }
    );

    if (!updatedOrganizer) {
      return res.status(404).json({ message: 'Organizer not found with that emsregistration ID' });
    }

    res.status(200).json({ message: 'Organizer updated successfully', organizer: updatedOrganizer });
  } catch (err) {
    res.status(500).json({ message: 'Error updating organizer', error: err.message });
  }
};

exports.getOrganizerByRegistrationId = async (req, res) => {
  try {
    const { emsregistrationId } = req.params;

    const organizer = await Organizer.findOne({ emsregistrationId });

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found with given emsregistrationId' });
    }

    res.status(200).json({ organizer });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching organizer', error: err.message });
  }
};
