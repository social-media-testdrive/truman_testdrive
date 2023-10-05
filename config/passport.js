const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
// const axios = require('axios');
const { Strategy: LocalStrategy } = require('passport-local');
// const { Strategy: FacebookStrategy } = require('passport-facebook');
// const { Strategy: SnapchatStrategy } = require('passport-snapchat');
// const { Strategy: TwitterStrategy } = require('@passport-js/passport-twitter');
// const { Strategy: TwitchStrategy } = require('twitch-passport');
// const { Strategy: GitHubStrategy } = require('passport-github2');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');
// const { Strategy: LinkedInStrategy } = require('passport-linkedin-oauth2');
// const { SteamOpenIdStrategy } = require('passport-steam-openid');
const { OAuthStrategy } = require('passport-oauth');
const { OAuth2Strategy } = require('passport-oauth');
const _ = require('lodash');
const moment = require('moment');

const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    return done(null, await User.findById(id));
  } catch (error) {
    return done(error);
  }
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() })
    .then((user) => {
      if (!user) {
        return done(null, false, { msg: `Email ${email} not found.` });
      }
      if (!user.password) {
        return done(null, false, { msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' });
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
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Google.
 */
const googleStrategyConfig = new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,           // Client ID from Google Developer Console
  clientSecret: process.env.GOOGLE_SECRET,   // Client Secret from Google Developer Console
  callbackURL: '/auth/google/callback',      // URL to which Google will redirect the user after granting/denying permission
  passReqToCallback: true                    // Passes the request to the callback, making `req` the first argument
}, async (req, accessToken, refreshToken, params, profile, done) => {
  try {
    /**
     * Helper function to log in the user and update the session.
     * @param {Object} user - The user object
     */
    const loginUserAndUpdateSession = async (user) => {
      req.login(user, (err) => {
        if (err) {
          return done(err);
        }
        return done(null, user);
      });
    };

    // If the user is already logged into our application
    if (req.user) {
      // Search for a user in our database with the Google ID from the profile
      const existingGoogleUser = await User.findOne({ google: profile.id });
      
      // If a user with the same Google ID is found and it's not the currently logged in user
      if (existingGoogleUser && (existingGoogleUser.id !== req.user.id)) {
        req.flash('errors', { msg: 'This google email is is not linked to an account.' });
        return done(null, existingGoogleUser);
      }

      // Fetch the current user from the database
      const user = await User.findOne({ email: req.user.email });

      // Update user's Google ID and save tokens
      user.google = profile.id;
      user.tokens.push({
        kind: 'google',
        accessToken,
        accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
        refreshToken,
      });
      user.name = user.name || profile.name.givenName;
      await user.save();
      
      req.flash('info', { msg: 'Google account has been linked.' });
      return loginUserAndUpdateSession(user);
    }

    // Search for a user with either matching Google ID or email address
    let user = await User.findOne({ $or: [{ google: profile.id }, { email: profile.emails[0].value }] });

    if (user) {
      // If a user with matching Google ID is found
      if (user.google === profile.id) {
        return done(null, user);
      } 
      // If a user with matching email address is found, but not linked with Google
      else if (user.email === profile.emails[0].value && !user.google) {
        req.flash('errors', { msg: 'Your account was registered using email and password. To enable Google login, sign in with that account then navigate to the profile page and link Google with your current account by pressing the "Link your Google Account" button.' });
        return done(null, false); // False means authentication failed
      }
    }

    // If no user is found, create a new user with the provided Google profile information
    user = new User();
    user.email = profile.emails[0].value;
    user.google = profile.id;
    user.tokens.push({
      kind: 'google',
      accessToken,
      accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
      refreshToken,
    });
    user.name = profile.name.givenName;
    await user.save();
    return loginUserAndUpdateSession(user);

  } catch (err) {
    // Handle any errors that occurred during the authentication process
    return done(err);
  }
});

// Register the Google strategy with Passport
passport.use('google', googleStrategyConfig);

// Register the Google strategy with the refresh-token library (to handle refreshing tokens)
refresh.use('google', googleStrategyConfig);


/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = async (req, res, next) => {
  const provider = req.path.split('/')[2];
  const token = req.user.tokens.find((token) => token.kind === provider);
  if (token) {
    if (token.accessTokenExpires && moment(token.accessTokenExpires).isBefore(moment().subtract(1, 'minutes'))) {
      if (token.refreshToken) {
        if (token.refreshTokenExpires && moment(token.refreshTokenExpires).isBefore(moment().subtract(1, 'minutes'))) {
          return res.redirect(`/auth/${provider}`);
        }
        try {
          const newTokens = await new Promise((resolve, reject) => {
            refresh.requestNewAccessToken(`${provider}`, token.refreshToken, (err, accessToken, refreshToken, params) => {
              if (err) reject(err);
              resolve({ accessToken, refreshToken, params });
            });
          });

          req.user.tokens.forEach((tokenObject) => {
            if (tokenObject.kind === provider) {
              tokenObject.accessToken = newTokens.accessToken;
              if (newTokens.params.expires_in) tokenObject.accessTokenExpires = moment().add(newTokens.params.expires_in, 'seconds').format();
            }
          });

          await req.user.save();
          return next();
        } catch (err) {
          console.log(err);
          return next();
        }
      } else {
        return res.redirect(`/auth/${provider}`);
      }
    } else {
      return next();
    }
  } else {
    return res.redirect(`/auth/${provider}`);
  }
};
