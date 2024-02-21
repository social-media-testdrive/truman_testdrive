const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    try {
        return done(null, await User.findById(id));
    } catch (error) {
        return done(error);
    }
});


/*
 * Sign in as a student with username.
 */

passport.use('student-local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'username',
    passReqToCallback: true
}, (req, username, password, done) => {
    User.findOne({
            // search for username, case insensitive
            username: {
                $regex: '^' + username + '$',
                $options: 'i'
            },
            accessCode: req.body.accessCode,
            deleted: false
        })
        .then((user) => {
            if (!user) {
                return done(null, false, { msg: 'Invalid username or login link.' });
            }
            return done(null, user);
        })
        .catch((err) => done(err));
}));

/*
 * Sign in as an instructor with username and password.
 */

passport.use('instructor-local', new LocalStrategy({
    usernameField: 'instructor_username',
    passwordField: 'instructor_password',
    passReqToCallback: true
}, (req, instructor_username, instructor_password, done) => {
    User.findOne({ username: instructor_username })
        .then((user) => {
            if (!user) {
                return done(null, false, { msg: 'User not found.' });
            }
            user.comparePassword(instructor_password, async(err, isMatch) => {
                if (err) { return done(err); }
                if (isMatch) {
                    // log in
                    return done(null, user);
                } else {
                    return done(null, false, { msg: 'Incorrect password.' });
                }
            });
        })
        .catch((err) => done(err));
}));


/**
 * Login Required middleware.
 */

exports.isAuthenticated = (req, res, next) => {
    const mod = req.path.split('/').slice(-1)[0];
    const isResearchVersion = process.env.isResearchVersion === "true";
    if ((!isResearchVersion && req.path === "/") || req.isAuthenticated()) {
        return next();
    }
    console.log(`Not authenticated for the following path: ${req.path}`);
    // Redirect to the appropriate url if not authenticated
    res.redirect(isResearchVersion ? '/login' : `/guest/${mod}`);
};