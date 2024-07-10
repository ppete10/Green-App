const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
    const userId = req.cookies.user_id;
    if (!userId) {
        res.locals.user = false;
        return res.status(401).redirect('/login');
    }
    try {
        req.user = {
            userId: userId,
        };
        res.locals.user = true;
        next();
    } catch (error) {
        console.error('Error verifying cookie:', error);
        res.status(401).json({ message: 'Invalid cookie' });
    }
};

module.exports = { authenticate };
