const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Role = require('./models/Role');
const MongoDBStore = require('connect-mongodb-session')(session);
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
// require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:3039',
            'http://localhost:3001',
            'https://vlu-attendance-server.vercel.app',
            'https://vlu-manage.vercel.app'
        ];
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: false,
    secret: 'dung123456'
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cors(corsOptions));
app.use(express.static('public'));

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;
const TENANT_ID = process.env.TENANT_ID;
// Passport configuration
passport.use(new MicrosoftStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: ['user.read'],
    tenant: TENANT_ID,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '';
        let user = await User.findOne({ microsoftId: profile.id });
        if (!user) {
            const studentRole = await Role.findOne({ tenrole: 'Chưa phân quyền' });
            user = new User({
                microsoftId: profile.id,
                displayName: profile.displayName,
                email: email,
                accessToken: accessToken,
                lastLogin: Date.now(),
                role: studentRole ? studentRole._id : null,
                status: 1,
                phone: profile.mobilePhone || '',
            });
            await user.save();
        } else {
            user.accessToken = accessToken;
            user.lastLogin = Date.now();
            await user.save();
        }

        if (user.status === 0) {
            return done(null, false, { message: 'User is not allowed to log in' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Routes
app.get('/auth/microsoft', passport.authenticate('microsoft'));

app.get('/api/auth/callback',
    passport.authenticate('microsoft', { failureRedirect: 'http://localhost:3001/admin?error=login_failed' }),
    (req, res) => {
        res.redirect(`${BASE_URL}/admin/home`);
    });

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect(`${BASE_URL}/admin`);
    });
});

app.get('/user', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const accessToken = req.user.accessToken;
    axios.get('https://graph.microsoft.com/v1.0/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then(response => res.json(response.data))
        .catch(error => res.status(500).json({ message: 'Error fetching user data' }));
});

// Serve static files
app.use('/admin', cors(corsOptions), express.static(path.resolve(__dirname, '../client-admin/build')));
app.get('/admin/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client-admin/build', 'index.html'));
});

// Additional APIs
app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.use(function (req, res, next) {
    if (!req.session) {
        return next(new Error('Oh no')) //handle error
    }
    next() //otherwise continue
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'welcome.html'));
});

