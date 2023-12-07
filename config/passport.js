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
        .exec(function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { msg: 'Invalid username or login link.' });
            }

            // found user, log in complete
            req.session.regenerate(function() {
                return done(null, user);
            });
        });
}));

/*
 * Sign in as an instructor with username and password.
 */

passport.use('instructor-local', new LocalStrategy({
    usernameField: 'instructor_username',
    passwordField: 'instructor_password',
    passReqToCallback: true
}, (req, instructor_username, instructor_password, done) => {
    User.findOne({ username: instructor_username }, async(err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { msg: 'Invalid username or password.' });
        }
        user.comparePassword(instructor_password, async(err, isMatch) => {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                // log in
                return done(null, user);
            }
            return done(null, false, { msg: 'Invalid username or password.' });
        });
    });
}));

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() })
        .then((user) => {
            if (!user) {
                return done(null, false, { msg: `Email ${email} not found.` });
            }
            user.comparePassword(password, (err, isMatch) => {
                if (err) { return done(err); }
                if (isMatch) {
                    return done(null, user);
                }
                return done(null, false, { msg: 'Invalid email or password.' });
            });
        })
        .catch((err) => done(err));
}));

/**
 * Login Required middleware.
 */

exports.isAuthenticated = (req, res, next) => {
    const mod = req.path.split('/').slice(-1)[0];
    // const isResearchVersion = process.env.isResearchVersion === "true";
    if ((!isResearchVersion && req.path === "/") || req.isAuthenticated()) {
        return next();
    }
    console.log(`Not authenticated for the following path: ${req.path}`);
    // Redirect to the appropriate url if not authenticated
    res.redirect(isResearchVersion ? '/login' : `/guest/${mod}`);
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
    const provider = req.path.split('/').slice(-1)[0];
    const token = req.user.tokens.find(token => token.kind === provider);
    if (token) {
        return next();
    } else {
        return res.redirect(`/auth/${provider}`);
    }
};