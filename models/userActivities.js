const db = require('../config/db');
const Activities = require('./Activities');

async function registerForActivity(req, res) {
    if (!req.user) {
        return res.redirect('/login');
    }

    const { activityId, currentUrl } = req.body;
    const userId = req.user.userId;

    const getActivityQuery = 'SELECT points FROM Activities WHERE activityId = ?';
    const insertUserActivityQuery = 'INSERT INTO UserActivities (userId, activityId, activityDate) VALUES (?, ?, NOW())';

    try {
        const [activityRows] = await db.query(getActivityQuery, [activityId]);
        if (activityRows.length === 0) {
            return res.status(404).send('Activity not found');
        }
        const activityPoints = activityRows[0].points;

        const updateUserQuery = 'UPDATE Users SET points = points + ? WHERE userId = ?';
        await db.query(updateUserQuery, [activityPoints, userId]);

        await db.query(insertUserActivityQuery, [userId, activityId]);

        const totalCarbonReduced = await Activities.getTotalCarbonReduced();
        const sort = req.query.sort || 'activityCount';
        const leaderboard = await Activities.getLeaderboard({ sort });
        const activities = await Activities.getActivities();
        const user = req.cookies.user_id;

        res.render('index', { 
            showSuccessAlert: true,
            totalCarbonReduced,
            leaderboard,
            sort,
            activities,
            user,
            currentUrl: currentUrl || '/#activities'
        });
    } catch (error) {
        console.error('Error registering for activity:', error);
        res.status(500).send('Error registering for activity');
    }
}

async function findByUserId(userId) {
    const query = `
        SELECT Activities.name, Activities.description ,Activities.points, UserActivities.activityDate 
        FROM UserActivities 
        JOIN Activities ON UserActivities.activityId = Activities.activityId 
        WHERE UserActivities.userId = ?
        ORDER BY UserActivities.activityDate DESC
    `;
    try {
        const [rows] = await db.query(query, [userId]);
        return rows;
    } catch (error) {
        console.error('Error fetching user rewards:', error);
        throw error;
    }
}

module.exports = {
    registerForActivity,
    findByUserId
};
