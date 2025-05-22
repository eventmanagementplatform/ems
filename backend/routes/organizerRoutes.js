const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadLogo');
const validateOrganizer = require('../middleware/validateOrganizer');
const {
  createOrganizer,
  getOrganizers,
  getOrganizerById,
  updateOrganizer,
  deleteOrganizer,
  deleteOrganizerByRegistrationId,
  updateOrganizerByRegistrationId,
  patchOrganizerByRegistrationId,
  getOrganizerByRegistrationId
} = require('../controllers/organizerController');

router.post('/', validateOrganizer, createOrganizer);
router.get('/', getOrganizers);
//router.get('/:id', getOrganizerById);
//router.put('/:id', upload.single('logo'), validateOrganizer, updateOrganizer);
router.put('/:emsregistrationId', updateOrganizerByRegistrationId);
//router.delete('/:id', deleteOrganizer);
router.delete('/:emsregistrationId', deleteOrganizerByRegistrationId);
router.patch('/:emsregistrationId', patchOrganizerByRegistrationId);
router.get('/:emsregistrationId', getOrganizerByRegistrationId);



module.exports = router;
