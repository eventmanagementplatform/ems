const express = require('express');
const router = express.Router();
const { addEvent } = require('../controllers/eventController');
const { authOrganizer } = require('../middleware/auth');

router.post('/addevent', addEvent);

module.exports = router;
