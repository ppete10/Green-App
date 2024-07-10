const User = require('../models/userModel');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser.length > 0) {
            return res.status(400).redirect('/register?error=true&message=This email is already registered.');
        }

        const newUser = await User.create(name, email, password);
        res.cookie('user_id', newUser.userId, { 
            httpOnly: true,
            maxAge: 86400000,
        });

        res.redirect('/');
    } catch (err) {
        console.error('Error during registration process:', err);
        res.status(500).redirect('/register?error=true&message=Internal server error during registration');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const results = await User.findByEmail(email);
        if (results.length === 0) {
            return res.status(400).redirect('/login?error=true&message=Invalid email or password.');
        }
        const user = results[0];

        if (password !== user.password) {
            return res.status(400).redirect('/login?error=true&message=Invalid email or password.');
        }
        res.cookie('user_id', user.userId, { 
            httpOnly: true,
            maxAge: 86400000,
        });
        res.redirect('/');
    } catch (err) {
        console.error('Error during login process:', err);
        res.status(500).redirect('/login?error=true&message=Internal server error during login.');
    }
};

const renderProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const user = await User.getUsersActivities(userId);
        if (!user || user.length === 0) {
            throw new Error('User not found');
        }
        res.render('profile', { user });
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const logout = async (req, res) => {
    try {
        res.cookie('user_id', '', { expires: new Date(0) });
        res.redirect('/?logout=success');
    } catch (err) {
        console.error('Error during logout process:', err);
        res.status(500).redirect('/error?message=Internal server error during logout');
    }
};

const updateProfile = async (req, res) => {
    const { userId } = req.user;
    const { name, email, password } = req.body;
    try {
        await User.update(userId, name, email, password);
        res.redirect('/profile?success=true&message=Profile updated successfully');
    } catch (err) {
        console.error('Error during profile update process:', err);
        res.status(500).redirect('/profile?error=true&message=This email is already used');
    }
};

module.exports = { register, login, renderProfile, updateProfile, logout };