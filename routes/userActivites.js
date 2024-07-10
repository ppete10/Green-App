const express = require('express');
const router = express.Router();
const { registerForActivity, renderUserActivity } = require('../controllers/userActivitiesController');
const  { authenticate } = require('../middleware/authMiddleware');

router.post('/registerActivity',authenticate , registerForActivity);
router.get('/userActivities', authenticate, renderUserActivity);

module.exports = router;

