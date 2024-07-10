const express = require('express');
const { register, login, renderProfile, updateProfile, logout } = require('../controllers/userController');
const  { authenticate} = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, renderProfile);
router.post('/profile/update', authenticate, updateProfile);
router.get('/logout', authenticate, logout);

module.exports = router;
