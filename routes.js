const express = require('express');
const router = express.Router();
const profileRoutes = require('./api/profiles');

router.use('/profiles', profileRoutes);

module.exports = router;
