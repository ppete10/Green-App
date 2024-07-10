const userActivitiesModel = require('../models/userActivities');

async function registerForActivity(req, res) {
    try {
        await userActivitiesModel.registerForActivity(req, res);
    } catch (error) {
        console.error('Error registering for activity:', error);
        res.status(500).redirect('/error?message=Error registering for activity');
    }
}

const renderUserActivity = async (req, res) => {
    try {
        const { userId } = req.user;
        const activities = await userActivitiesModel.findByUserId(userId);

        res.render('userActivities', { activities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerForActivity,
    renderUserActivity
};