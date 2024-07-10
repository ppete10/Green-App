const Activities = require('../models/Activities');

async function renderIndex(req, res) {
    try {
        const totalCarbonReduced = await Activities.getTotalCarbonReduced();
        const user = req.cookies.user_id;
        const sort = req.query.sort || 'activityCount';
        const leaderboard = await Activities.getLeaderboard({ sort });
        const activities = await Activities.getActivities();

        res.render('index', { totalCarbonReduced, leaderboard, sort, activities, user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    renderIndex,
};
