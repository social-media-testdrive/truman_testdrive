const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const axios = require('axios');
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
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true
}, async (req, accessToken, refreshToken, params, profile, done) => {
  try {
    if (req.user) {
      const existingUser = await User.findOne({ google: profile.id });
      if (existingUser && (existingUser.id !== req.user.id)) {
        req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        return done(null, existingUser);
      }
      const user = await User.findById(req.user.id);
      user.google = profile.id;
      user.tokens.push({
        kind: 'google',
        accessToken,
        accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
        refreshToken,
      });
      user.profile.name = user.profile.name || profile.displayName;
      user.profile.gender = user.profile.gender || profile._json.gender;
      user.profile.picture = user.profile.picture || profile._json.picture;
      await user.save();
      req.flash('info', { msg: 'Google account has been linked.' });
      return done(null, user);
    }
    const existingUser = await User.findOne({ google: profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }
    const existingEmailUser = await User.findOne({ email: profile.emails[0].value });
    if (existingEmailUser) {
      req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
      return done(null, existingEmailUser);
    }
    const user = new User();
    user.email = profile.emails[0].value;
    user.google = profile.id;
    user.tokens.push({
      kind: 'google',
      accessToken,
      accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
      refreshToken,
    });
    user.profile.name = profile.displayName;
    user.profile.gender = profile._json.gender;
    user.profile.picture = profile._json.picture;
    await user.save();
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});
passport.use('google', googleStrategyConfig);
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
