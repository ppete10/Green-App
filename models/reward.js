const db = require('../config/db');

async function getAllRewards() {
    const query = `
        SELECT * FROM Rewards
    `;
    try {
        const [rows] = await db.query(query);
        return rows;
    } catch (error) {
        console.error('Error fetching activities:', error);
        throw error;
    }
}

async function getRewardById(rewardId) {
    const query = `
        SELECT * FROM Rewards WHERE rewardId = ?
    `;
    try {
        const [results] = await db.query(query, [rewardId]);
        return results;
    } catch (error) {
        console.error('Error fetching activities:', error);
        throw error;
    }
}


module.exports = { getAllRewards, getRewardById };
