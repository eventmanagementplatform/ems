const express = require('express');
const router = express.Router();
const { orgloginUser } = require('../controllers/orgloginController');

router.post('/orgloginUser', orgloginUser);

module.exports = router;
