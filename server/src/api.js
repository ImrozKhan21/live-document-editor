const express = require('express');
const path = require("path");
const passport = require("passport");
const {Strategy} = require("passport-google-oauth20");
const helmet = require("helmet");
const cookieSession = require("cookie-session");
const cors = require('cors');
const {createUser, getUsers} = require("./user/user.model");

const api = express();

api.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:8080', 'https://studio.apollographql.com'], // Adjust according to your Angular app's origin
    credentials: true, // To allow sending of cookies and authorization headers with CORS requests
}));

const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    COOKIE_KEY_1: process.env.COOKIE_KEY_1,
    COOKIE_KEY_2: process.env.COOKIE_KEY_2,
}

const AUTH_OPTIONS = {
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}

const createUserAfterLogin = async (profile, done) => {
    const username = profile.displayName ? profile.displayName : profile.emails[0].value.split('@')[0];
    const email = profile.emails[0]?.value;
    const photo = profile.photos[0]?.value;
    const googleId = profile.id;
    try {
        const allUsers = await getUsers();
        const currentUser = allUsers.find(user => user.email === email);
        if (!currentUser) {
            await createUser({username, email, photo, googleId});
            done(null, profile);
            return;
        }
        done(null, profile);
    } catch (e) {
        done(null, profile);
    }
}

const verifyCallback = async (accessToken, refreshToken, profile, done) => {
    // comes here after user has been logged in and token ahs been exchanged
    // console.log('accessToken', accessToken);
    // console.log('refreshToken', refreshToken);
    // console.log('profile', profile);
    await createUserAfterLogin(profile, done);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback)); // passport-google-oauth20  is a strategy for passport

//serializeUser saves session to cookie
passport.serializeUser((user, done) => {
    // we can save as {googleId: user.id, email: user.emails[0].value} is what can be passed to front end
    // we can minimize the size, as from google we get a lot of data, we can save only what is needed in cookie
    const photo = user.photos[0]?.value;
    const email = user.emails[0].value;
    done(null, {googleId: user.id, email, photo}); // in session-cookie where we use db to persist session, we save just user.id in cookie
                         // and then using that id we lookup in db to get user in deserializeUser
});
//deserializeUser loads session from cookie
passport.deserializeUser((userData, done) => {
    // here we can get user from db using obj, and if we just need if we can use that for cookie-session
    done(null, userData);
});

// api.use(helmet()); // helmet is a middleware that adds security headers to our app, it's a collection of 14 smaller middleware functions that set security headers
api.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
            scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
            manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
            frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
    },
}));

// we make using cookie session secure by signing the cookie using keys so that it can't be tampered with,
// signing cookies only lives on server, so if someone uses change cookie in browser it will fail
// so in cookie you'll see two cookies one for session and one for session.sig, session.sig is the signature of session and
// if someone changes session, session.sig will not match and it will fail
api.use(cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2], // array because sometimes you want to rotate keys so that old keys can be used to decrypt old cookies and can be removed later
}));

// register regenerate & save after the cookieSession middleware initialization doing below because latest version of passport doesn't have these methods
// or we can use express-session instead of cookie-session
// or we revert to older version of passport
// below are just dummy methods to avoid error of req.session.regenerate is not a function
api.use(function (request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
});

api.use(passport.initialize());
api.use(passport.session()); // this will tell passport to use cookie session to manage session

function checkLoggedIn(req, res, next) { // passport session sets req.user if user is logged in
    const isLoggedIn = req.isAuthenticated() && req.user;
    if (!isLoggedIn) {
        return res.status(401).json({
            error: 'You must log in!'
        })
    }
    next();
}

api.get('/login', passport.authenticate('google', {
    scope: ['email']
}));

api.get('/logout', (req, res, next) => {
    req.logout((err) => {  // this will remove req.user and clear the session  (passport will have this logout function)
        if (err) {
            return next(err);
        }
        return res.status(200).json({loggedIn: false, user: req.user});
    });
});


api.get('/check-session', checkLoggedIn, (req, res) => {
    // req.user is what we get from deserializeUser, and what serializeUser saves in cookie
    return res.status(200).json({loggedIn: true, user: req.user});
});

api.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/failure',
    successRedirect: 'http://localhost:4200',
    session: true
}), (req, res) => {
    //res.json({auth: req.isAuthenticated()});
    // console.log('Google called us back, req.user', req.user);
});

api.get('/secret', checkLoggedIn, (req, res) => { // adding checkLoggedIn middleware before route, we can add as many as middleware functions
    return res.send('Your personal value is 32');
});

api.get('/failure', (req, res) => { // adding checkLoggedIn middleware before route, we can add as many as middleware functions
    return res.send('Failed to login');
});

/*api.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

api.use(express.static(path.join(__dirname, "public")));*/

/*
api.use('/', express.static('index.html'));
*/

module.exports = api;