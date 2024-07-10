const UserReward = require('../models/userReward');
const Reward = require('../models/reward');

const renderRewards = async (req, res) => {
    try {
        const allRewards = await Reward.getAllRewards();
        const { userId } = req.user;
        const rewards = await UserReward.findByUserId(userId);

        res.render('reward', { allRewards, rewards });

    } catch (error) {
        console.error(error);
        res.redirect('/rewards?error=true&message=Failed to render rewards');
    }
};

const redeemReward = async (req, res) => {
    try {
        const { rewardId } = req.body;
        const { userId } = req.user;
        const fetchedReward = await Reward.getRewardById(rewardId);
        const pointsRequired = fetchedReward.pointsRequired;

        await UserReward.redeemReward(userId, rewardId, pointsRequired);

        res.redirect('/rewards?success=true&message=Reward redeemed successfully');
    } catch (error) {
        console.error(error);
        return res.redirect('/rewards?error=true&message=Insufficient points');
    }
};

const useReward = async (req, res) => {
    try {
        const { rewardId } = req.body;
        const { userId } = req.user;

        await UserReward.useReward(userId, rewardId);

        res.redirect('/rewards?success=true&message=Reward used successfully');
    } catch (error) {
        console.error(error);
        return res.redirect('/rewards?error=true&message=Failed to use reward');
    }
};

module.exports = { renderRewards, redeemReward, useReward };
