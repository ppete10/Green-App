const db = require('../config/db');

async function findByUserId(userId) {
    const query = `
        SELECT r.rewardId, r.name
        FROM UserRewards ur
        JOIN Rewards r ON ur.rewardId = r.rewardId
        WHERE ur.userId = ?
    `;
    try {
        const [rows] = await db.query(query, [userId]);
        return rows;
    } catch (error) {
        console.error('Error fetching user rewards:', error);
        throw error;
    }
}

async function redeemReward(userId, rewardId) {
    const getRewardQuery = 'SELECT pointsRequired FROM Rewards WHERE rewardId = ?';
    const getUserPointsQuery = 'SELECT points FROM Users WHERE userId = ?';
    const updateUserPointsQuery = 'UPDATE Users SET points = points - ? WHERE userId = ?';
    const insertUserRewardQuery = 'INSERT INTO UserRewards (userId, rewardId, redeemDate) VALUES (?, ?, NOW())';

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [rewardRows] = await connection.query(getRewardQuery, [rewardId]);
        if (rewardRows.length === 0) {
            throw new Error('Reward not found');
        }
        const pointsRequired = rewardRows[0].pointsRequired;

        const [userRows] = await connection.query(getUserPointsQuery, [userId]);
        if (userRows.length === 0) {
            throw new Error('User not found');
        }
        const userPoints = userRows[0].points;

        if (userPoints < pointsRequired) {
            throw new Error('Insufficient points');
        }
        await connection.query(updateUserPointsQuery, [pointsRequired, userId]);
        await connection.query(insertUserRewardQuery, [userId, rewardId]);

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        console.error('Error redeeming reward:', error);
        throw error;
    } finally {
        connection.release();
    }
}


async function useReward(userId, rewardId) {
    const query = `
       DELETE FROM UserRewards 
       WHERE userId = ? AND rewardId = ? 
       LIMIT 1
    `;
    try {
        const [rows] = await db.query(query, [userId, rewardId]);
        return rows;
    } catch (error) {
        console.error('Error deleting user reward:', error);
        throw error;
    }
}


async function getUserPoints(userId) {
    const query = 'SELECT points FROM Users WHERE userId = ?';
    try {
        const [rows] = await db.query(query, [userId]);
        if (rows.length === 0) {
            throw new Error('User not found');
        }
        return rows[0].points;
    } catch (error) {
        console.error('Error fetching user points:', error);
        throw error;
    }
}



module.exports = { findByUserId, getUserPoints, redeemReward, useReward };
