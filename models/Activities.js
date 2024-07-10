const db = require('../config/db');
const moment = require('moment');

async function getActivities() {
    const query = `
        SELECT 
            Activities.activityId,
            Activities.name,
            Activities.description,
            Activities.points,
            COUNT(UserActivities.activityId) AS numParticipants
        FROM Activities
        LEFT JOIN UserActivities ON Activities.activityId = UserActivities.activityId
        GROUP BY Activities.activityId, Activities.name, Activities.description, Activities.points
    `;
    try {
        const [rows] = await db.query(query);
        return rows;
    } catch (error) {
        console.error('Error fetching activities:', error);
        throw error;
    }
}


async function getTotalCarbonReduced() {
    const query = `
    SELECT FORMAT(SUM(Activities.carbon_reduction * UserActivityCounts.activity_count), 0) AS totalCarbonReduced
    FROM (
        SELECT activityId, COUNT(*) AS activity_count
        FROM UserActivities
        GROUP BY activityId
    ) AS UserActivityCounts
    JOIN Activities ON Activities.activityId = UserActivityCounts.activityId
`;
    const [rows] = await db.query(query);
    return rows[0].totalCarbonReduced || 0;
}

async function getLeaderboard(params) {
    const { sort } = params;
    let leaderboardQuery;

    if (sort === 'activityCount') {
        leaderboardQuery = `
            SELECT U.userId, U.name, COUNT(UA.activityId) AS activityCount
            FROM Users U
            LEFT JOIN UserActivities UA ON U.userId = UA.userId
            GROUP BY U.userId, U.name
            ORDER BY activityCount DESC;
        `;
    } else if (sort === 'lastActivityDate') {
        leaderboardQuery = `
            SELECT U.userId, U.name, MAX(UA.activityDate) AS lastActivityDate
            FROM Users U
            LEFT JOIN UserActivities UA ON U.userId = UA.userId
            GROUP BY U.userId, U.name
            ORDER BY lastActivityDate DESC;
        `;
    } else {
        leaderboardQuery = `
            SELECT U.userId, U.name, COUNT(UA.activityId) AS activityCount
            FROM Users U
            LEFT JOIN UserActivities UA ON U.userId = UA.userId
            GROUP BY U.userId, U.name
            ORDER BY activityCount DESC;
        `;
    }

    try {
        const [rows] = await db.query(leaderboardQuery);
        if (sort === 'lastActivityDate') {
            // จัดรูปแบบวันที่ให้เป็น YYYY-MM-DD
            rows.forEach(row => {
                row.lastActivityDate = row.lastActivityDate ? moment(row.lastActivityDate).format('DD-MM-YYYY') : null;
            });
        }
        return rows;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
}


module.exports = {
    getTotalCarbonReduced,
    getLeaderboard,
    getActivities,
};

