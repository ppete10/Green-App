const express = require('express');
const {  renderRewards, redeemReward, useReward } = require('../controllers/rewardController');
const  { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/rewards', authenticate, renderRewards);
router.post('/rewards/redeem', authenticate, redeemReward);
router.post('/rewards/use', authenticate, useReward);

module.exports = router;
