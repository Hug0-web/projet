const express = require('express');
const userController = require('../Controller/UserController');
const authMiddleware = require('../Middleware/authMiddleware');

const router = express.Router();

router.use('/', userController);

module.exports = router;