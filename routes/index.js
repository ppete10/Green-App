const express = require('express');
const router = express.Router();
const { renderIndex } = require('../controllers/indexController');

router.get('/', renderIndex);

module.exports = router;
