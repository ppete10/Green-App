const express = require('express');
const { readdirSync } = require('fs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

readdirSync('./routes').forEach((file) => {
    const route = require('./routes/' + file);
    if (typeof route === 'function') {
        app.use(route);
    } else {
        console.error(`Error: ${file} does not export a valid middleware function`);
    }
});


app.use(express.static(path.join(__dirname, 'views')));

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/error', (req, res) => {
    const { message } = req.query;
    res.render('error', { message });
});

app.get('/errorReward', (req, res) => {
    const { message } = req.query;
    res.render('errorReward', { message });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/profile', (req, res) => {
    res.render('profile');
});

app.get('/logout', (req, res) => {
    res.render('login');
});

const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

const rewardRoutes = require('./routes/reward');
app.use('/rewards', rewardRoutes);



// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
