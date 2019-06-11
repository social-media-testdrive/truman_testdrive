const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const passport = require('passport');
const moment = require('moment');
const User = require('../models/User');
const Class = require('../models/Class.js');
const Notification = require('../models/Notification.js');

//create random id for guest accounts
function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}



/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

/*************
Get Notifcation Bell signal
**************/
exports.checkBell = (req, res) => {
if (req.user) {

    var user = req.user;

    Notification.find({ $or: [ { userPost: user.numPosts  }, { userReply: user.numReplies }, { actorReply: user.numActorReplies } ] })
        .populate('actor')
        .exec(function (err, notification_feed) {

          if (err) { return next(err); }

          if (notification_feed.length == 0)
          {
            //peace out - send empty page - 
            //or deal with replys or something IDK
            console.log("No User Posts yet. Bell is black");
            return res.send({result:false}); 
          }

          //We have values we need to check
          //When this happens
          else{

            for (var i = 0, len = notification_feed.length; i < len; i++) {

              //Do all things that reference userPost (read,like, actual copy of ActorReply)
              if (notification_feed[i].userPost >= 0)
              {

                var userPostID = notification_feed[i].userPost;
                var user_post = user.getUserPostByID(userPostID);
                var time_diff = Date.now() - user_post.absTime;
                if (user.lastNotifyVisit)
                {
                  var past_diff = user.lastNotifyVisit - user_post.absTime;
                }
                
                else
                {
                  var past_diff = 0;
                }

                if(notification_feed[i].time <= time_diff && notification_feed[i].time > past_diff)
                {
                  return res.send({result:true});
                }

              }//UserPost

            }//for loop

            //end of for loop and no results, so no new stuff
            console.log("&&Bell Check&& End of For Loop, no Results")
            res.send({result:false});
          }


        });//Notification exec


  }

 else{
  console.log("No req.user")
  return res.send({result:false});
}
};


/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  //req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.assert('username', 'Username cannot be blank').notEmpty();
  //req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    if (!(user.active)) {
      console.log("FINAL");
      req.flash('final', { msg: '' });
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      //req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect('/');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 TODO - add code to take survey?? or check if you have seen experinetal post yet
 */
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/login');
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  //req.assert('username', 'Username cannot be blank').notEmpty();
  //req.assert('password', 'Password must be at least 4 characters long').len(4);
  //req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  //xyzzy
  req.assert('signupcode', 'Wrong Sign Up Code').notEmpty();
  
  const errors = req.validationErrors();

  if (errors) {
    req.flash('Sign Up Code Can Not Be Blank. Please Try Again', errors);
    return res.redirect('/signup');
  }
  //default Student - No Class Assignment
  else if (req.body.signupcode == "0451")
  {
    res.redirect('/create_username');
  }

  //default Student - No Class Assignment
  else if (req.body.signupcode == "xyzzy")
  {
    res.redirect('/create_instructor');
  }

  //Check if belong to Class - if not- then reject and try again
  else
  {

    Class.findOne({ accessCode: req.body.signupcode }, (err, existingClass) => {
      if (err) { return next(err); }
      //found the class this belongs to. Continue making account
      if (existingClass) {
        res.redirect('/create_username_class/'+req.body.signupcode);
      }
      else
      {
        req.flash('errors', { msg: 'No Class with that Access Code found. Please try again.' });
        return res.redirect('/signup');
      }
      
      });//end of CLASS FIND ONE

  }

};

/**
 * GET /create_instructor
 * Create instructor page.
 */
exports.getSignupInstructor = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/instructor', {
    title: 'Create Instructor Username'
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignupInstructor = (req, res, next) => {
  req.assert('username', 'Username cannot be blank').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  //req.assert('signupcode', 'Wrong Sign Up Code').equals("0451");
  
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/create_instructor');
  }

  const user = new User({
    password: req.body.password,
    username: req.body.username,
    group: 'no:no',
    active: true,
    ui: 'no', //ui or no
    notify: 'no', //no, low or high
    isInstructor: true,
    lastNotifyVisit : Date.now()
  });

  user.profile.name = req.body.name || '';
  user.profile.location = req.body.location || '';
  user.profile.bio = req.body.bio || '';
  user.profile.picture = req.body.picture || '';

  User.findOne({ username: req.body.username }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that Username already exists.' });
      return res.redirect('/create_username');
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
};

/**
 * get Guest accout
 * Create a new local account.
 */
exports.getGuest = (req, res, next) => {


  const user = new User({
    password: "thinkblue",
    username: "guest"+makeid(10),
    group: 'no:no',
    active: true,
    ui: 'no', //ui or no
    notify: 'no', //no, low or high
    isGuest: true,
    lastNotifyVisit : Date.now()
  });

  user.profile.name = "Guest";
  user.profile.location = "Guest Town";
  user.profile.bio = '';
  user.profile.picture = 'avatar-icon.svg';

  User.findOne({ username: req.body.username }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that Username already exists.' });
      return res.redirect('/guest/'+req.params.modId);
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/intro/'+req.params.modId);
      });
    });
  });
};

/**
 * GET /create_username
 * Create Username page.
 */
exports.getSignupUsername = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/username', {
    title: 'Create Username'
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignupUsername = (req, res, next) => {
  req.assert('username', 'Username cannot be blank').notEmpty();
  //req.assert('password', 'Password must be at least 4 characters long').len(4);
  //req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  //req.assert('signupcode', 'Wrong Sign Up Code').equals("0451");
  
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/create_username');
  }

  //random assignment of experimental group
  const user = new User({
    password: "thinkblue",
    username: req.body.username,
    group: 'no:no',
    active: true,
    ui: 'no', //ui or no
    notify: 'no', //no, low or high
    lastNotifyVisit : Date.now()
  });

  

  User.findOne({ username: req.body.username }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that Username already exists.' });
      return res.redirect('/create_username');
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/create_password');
      });
    });
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignupUsernameClass = (req, res, next) => {
  req.assert('username', 'Username cannot be blank').notEmpty();
  //req.assert('password', 'Password must be at least 4 characters long').len(4);
  //req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  //req.assert('signupcode', 'Wrong Sign Up Code').equals("0451");
  
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/create_username');
  }

  //random assignment of experimental group
  const user = new User({
    password: "thinkblue",
    username: req.body.username,
    group: 'no:no',
    active: true,
    ui: 'no', //ui or no
    notify: 'no', //no, low or high
    lastNotifyVisit : Date.now()
  });

  

  User.findOne({ username: req.body.username }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that Username already exists.' });
      return res.redirect('/create_username');
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        
        if (err) {
          return next(err);
        }

        //req.params.classId
        Class.findOne({ accessCode: req.params.classId }, (err, existingClass) => {
          if (err) { return next(err); }

          //found the class this belongs to. add student to Class
          if (existingClass) {
            existingClass.students.push(user);

            existingClass.save((err) => {
              if (err) { return next(err); }
                res.redirect('/create_password');
            });//exsistingClass.save
          }//if existingClass

        });//Class.findOne 

        
      });//req.logIn
    });//user.save
  });//User.findOne
};

/**
 * GET /create_password
 * Signup password page.
 */
exports.getSignupPassword = (req, res) => {

  res.render('account/password', {
    title: 'Create Password'
  });
};

/**
 * POST /create_password
 * Update Password information.
 */
exports.postSignupPassword = (req, res, next) => {

  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/create_password');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    //user.email = req.body.email || '';
    user.password = req.body.password;
    //user.profile.name = req.body.name || '';
    //user.profile.location = req.body.location || '';
    //user.profile.bio = req.body.bio || '';

    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
          return res.redirect('/create_password');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Password has been created.' });
      res.redirect('/create_name');
    });
  });
};

/**
 * GET /create_name
 * Signup name page.
 */
exports.getSignupName = (req, res) => {

  res.render('account/name_picture', {
    title: 'Create Name'
  });
};

/**
 * POST /create_name
 * Update Name information.
 */
exports.postSignupName = (req, res, next) => {


  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    //user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    //user.profile.location = req.body.location || '';
    //user.profile.bio = req.body.bio || '';
    user.profile.picture = req.body.picture || '';

    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
          return res.redirect('/create_name');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Name and Picture has been updated.' });
      res.redirect('/create_bio');
    });
  });
};

/**
 * GET /create_bio
 * Signup bio page.
 */
exports.getSignupBio = (req, res) => {

  res.render('account/bio_location', {
    title: 'Create Bio'
  });
};

/**
 * POST /create_bio
 * Update Bio information.
 */
exports.postSignupBio = (req, res, next) => {


  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    //user.email = req.body.email || '';
    //user.profile.name = req.body.name || '';
    user.profile.location = req.body.location || '';
    user.profile.bio = req.body.bio || '';
    //user.profile.picture = req.body.picture || '';

    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
          return res.redirect('/create_name');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Bio and Location has been updated.' });
      res.redirect('/review/signup/wait');
    });
  });
};

/**
 * GET /review/signup
 * Profile page.
 */
exports.getSignupReview= (req, res) => {
  res.render('account/review', {
    title: 'Review your Account'
  });
};





/**
 * POST /account/profile
 * Update profile information.
 */
exports.postSignupInfo = (req, res, next) => {


  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    //user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.location = req.body.location || '';
    user.profile.bio = req.body.bio || '';

    if (req.file)
    {
      //console.log("Changeing Picture now to: "+ req.file.filename);
      user.profile.picture = req.file.filename;
    }

    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
          return res.redirect('/signup_info');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Profile information has been updated.' });
      res.redirect('/info');
    });
  });
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
  res.render('account/profile', {
    title: 'Account Management'
  });
};

/**
 * GET /signup_info
 * Signup Info page.
 */
exports.getSignupInfo = (req, res) => {

  res.render('account/signup_info', {
    title: 'Add Information'
  });
};

/**
 * GET /getMe
 * Profile page.
 */
exports.getMe = (req, res) => {

  User.findById(req.user.id)
  .populate({ 
       path: 'posts.reply',
       model: 'Script',
       populate: {
         path: 'actor',
         model: 'Actor'
       } 
    })
  .exec(function (err, user) {
    if (err) { return next(err); }

    var allPosts = user.getPostsAndReplies();

    res.render('me', { posts: allPosts });

  });


};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
  //req.assert('email', 'Please enter a valid email address.').isEmail();
  //req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    //user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    //user.profile.gender = req.body.gender || '';
    user.profile.location = req.body.location || '';
    //user.profile.website = req.body.website || '';
    user.profile.bio = req.body.bio || '';

    if (req.file)
    {
      console.log("Changeing Picture now to: "+ req.file.filename);
      user.profile.picture = req.file.filename;
    }

    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
          return res.redirect('/account');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Profile information has been updated.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.getDeleteAccount = (req, res, next) => {
  console.log("In postDeleteAccount");
  //is this a guest account?
  if(typeof req.user.isGuest !== 'undefined' && req.user.isGuest)
  {
    console.log("@#@#@#@Deleting Guest User")
    User.remove({ _id: req.user.id }, (err) => {
      if (err) { return next(err); }
      req.logout();
      //req.flash('info', { msg: 'Your account has been deleted.' });
      //res.redirect('/');
      res.redirect('/');
    });
  }
  else
  {
    console.log("Deleting user feed posts Actions")
    User.findById(req.user.id, (err, user) => {
      //somehow user does not exist here
      if (err) { return next(err); }
      console.log("@@@@@@@@@@@  /deleteUserFeedActions req body  ", req.body);
      
      user.feedAction =[];
      user.save((err) => {
        if (err) {
          if (err.code === 11000) {
            req.flash('errors', { msg: 'Something in delete feedAction went crazy. You should never see this.' });
            return res.redirect('/');
          }
          return next(err);
        }      
        res.redirect('/');
      });
    });
  }
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
  const provider = req.params.provider;
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user[provider] = undefined;
    user.tokens = user.tokens.filter(token => token.kind !== provider);
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('info', { msg: `${provider} account has been unlinked.` });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};
