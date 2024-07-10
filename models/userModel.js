const pool = require('../config/db');

const User = {
    create: async (name, email, password) => {
        const query = 'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)';
        const [results] = await pool.execute(query, [name, email, password]);
        const userId = results.insertId;
        
        const [newUser] = await pool.execute('SELECT * FROM Users WHERE userId = ?', [userId]);
        return newUser[0];
    },
    findByEmail: async (email) => {
        const query = "SELECT * FROM Users WHERE email = ?";
        const [results] = await pool.execute(query, [email]);
        return results;
    },
    update: async (userId, name, email, password) => {
        const query = 'UPDATE Users SET name = ?, email = ?, password = ? WHERE userId = ?';
        const [results] = await pool.execute(query, [name, email, password, userId]);
        return results;
    },

    getUsersActivities: async (userId) => {
        const query = `
            SELECT u.*, 
                   COUNT(ua.userActivityId) AS activityCount
            FROM Users u
            LEFT JOIN UserActivities ua ON u.userId = ua.userId
            WHERE u.userId = ?
            GROUP BY u.userId;
        `;
        const [results] = await pool.execute(query, [userId]);
        return results;
    },

};

module.exports = User;
