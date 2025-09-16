const express = require('express');
const contactController = require('../Controller/ContactController');
const authMiddleware = require('../Middleware/authMiddleware');

const router = express.Router();

router.use('/', contactController);

module.exports = router;