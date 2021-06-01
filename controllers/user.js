const fs = require('fs');
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
  // commented out by Anna
  // if (req.user) {
  //   return res.redirect('/');
  // }
  res.render('account/login', {
    title: 'Login'
  });
};


/**
 * GET /classl=Login
 * Login page for a student in a class.
 */
exports.getClassLogin = (req, res) => {
  // commented out by Anna
  // if (req.user) {
  //   return res.redirect('/');
  // }
  res.render('account/classLogin', {
    title: 'Class Login',
    accessCode: req.params.accessCode
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
            //console.log("No User Posts yet. Bell is black");
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
            //console.log("&&Bell Check&& End of For Loop, no Results")
            res.send({result:false});
          }


        });//Notification exec


  }

 else{
  //console.log("No req.user")
  return res.send({result:false});
}
};


/**
 * POST /studentLogin
 * Sign in using username.
 */
exports.postStudentLogin = (req, res, next) => {
  //req.assert('email', 'Email is not valid').isEmail();
  // commented out by Anna
  //req.assert('password', 'Password cannot be blank').notEmpty();
  req.assert('username', 'Please enter your username.').notEmpty();
  //req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect(`/classLogin/${req.params.accessCode}`);
  }

  passport.authenticate('student-local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('errors', info);
      return res.redirect(`/classLogin/${req.params.accessCode}`);
    }
    if (!(user.active)) {
      //console.log("FINAL");
      req.flash('final', { msg: '' });
      return res.redirect(`/classLogin/${req.params.accessCode}`);
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      //req.flash('success', { msg: 'Success! You are logged in.' });
      var temp = req.session.passport; // {user: 1}
       req.session.regenerate(function(err){
         //req.session.passport is now undefined
         req.session.passport = temp;
         req.session.save(function(err){
           user.logUser(Date.now());
           return res.redirect('/');
         });
       });
    });
  })(req, res, next);
};

/**
 * POST /instructorLogin
 * Sign in using username and password.
 */
 exports.postInstructorLogin = (req, res, next) => {
   //req.assert('email', 'Email is not valid').isEmail();
   req.assert('instructor_password', 'Password cannot be blank').notEmpty();
   req.assert('instructor_username', 'Username cannot be blank').notEmpty();
   //req.sanitize('email').normalizeEmail({ remove_dots: false });

   const errors = req.validationErrors();

   if (errors) {
     req.flash('errors', errors);
     return res.redirect('/login');
   }

   passport.authenticate('instructor-local', (err, user, info) => {
     if (err) { return next(err); }
     if (!user) {
       req.flash('errors', info);
       return res.redirect('/login');
     }
     if (!(user.active)) {
       //console.log("FINAL");
       req.flash('final', { msg: '' });
       return res.redirect('/login');
     }
     req.logIn(user, (err) => {
       if (err) { return next(err); }
       // regenerate the session
       var temp = req.session.passport; // {user: 1}
        req.session.regenerate(function(err){
          //req.session.passport is now undefined
          req.session.passport = temp;
          req.session.save(function(err){
              return res.redirect('/');
          });
        });
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
  req.session.regenerate(function() {
    res.redirect('/login');
  })
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
  // if (req.user) {
  //   return res.redirect('/');
  // }
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
// commented out by Anna

  // req.assert('signupcode', 'Wrong Sign Up Code').notEmpty();
  //
  // const errors = req.validationErrors();
  //
  // if (errors) {
  //   req.flash('Sign Up Code Can Not Be Blank. Please Try Again', errors);
  //   return res.redirect('/signup');
  // }
  // //default Student - No Class Assignment
  // else if (req.body.signupcode == "0451")
  // {
  //   res.redirect('/create_username');
  // }
  //
  // //default Student - No Class Assignment
  // else if (req.body.signupcode == "xyzzy")
  // {
  //   res.redirect('/create_instructor');
  // }
  //
  // //Check if belong to Class - if not- then reject and try again
  // else
  // {
  //
  //   Class.findOne({ accessCode: req.body.signupcode }, (err, existingClass) => {
  //     if (err) { return next(err); }
  //     //found the class this belongs to. Continue making account
  //     if (existingClass) {
  //       res.redirect('/create_username_class/'+req.body.signupcode);
  //     }
  //     else
  //     {
  //       req.flash('errors', { msg: 'No Class with that Access Code found. Please try again.' });
  //       return res.redirect('/signup');
  //     }
  //
  //     });//end of CLASS FIND ONE
  //
  // }

  req.assert('signupcode', 'Wrong Sign Up Code').notEmpty();
  const user = new User({
    //password: "thinkblue",
    username: req.body.signupcode,
    //group: 'no:no',
    active: true,
    //ui: 'no', //ui or no
    //notify: 'no', //no, low or high
    //isGuest: false,
    start : Date.now()
  });

  user.profile.name = "Guest";
  user.profile.location = "Guest Town";
  user.profile.bio = '';
  user.profile.picture = 'avatar-icon.svg';
  //console.log("New Guest is now: "+ user.profile.name);

  User.findOne({ username: req.body.signupcode }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', {
        msg: 'This username is taken. Please choose a different one.'
      });
      return res.redirect('/signup');

    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        //console.log("All done with Guest making!");
        //res.redirect('/intro/'+req.params.modId);
        res.redirect('/');
      });
    });
  });


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

  if (req.params.modId === "delete") {
    // avoiding a specific user behavior that causes 500 errors
    res.send({
      result: "failure"
    });
  }
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
  //console.log("New Guest is now: "+ user.profile.name);

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
        var temp = req.session.passport; // {user: 1}
         req.session.regenerate(function(err){
           //req.session.passport is now undefined
           req.session.passport = temp;
           req.session.save(function(err){
               return res.redirect('/intro/'+req.params.modId);
           });
         });

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
    title: 'Account Management',
    mod: req.params.modId
  });
};

/**
 * GET /signup_info
 * Signup Info page.
 */
exports.getSignupInfo = (req, res) => {

  res.render('account/signup_info', {
    title: 'Add Information', mod: req.params.modId
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
 * post a pageLog
 */
exports.postPageLog = (req, res, next) => {

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.logPage(Date.now(), req.body.subdirectory1, req.body.subdirectory2);
    user.save((err) => {
      if (err) {
        return next(err);
      }
      res.send({result:"success"});
    });
  });
};

exports.getHabitsTimer = (req, res) => {
    User.findById(req.user.id)
      .exec(function (err, user){
        var startTime = user.firstHabitViewTime;
        var totalTimeViewedHabits = 0;
        if(user.habitsTimer){
          for(var i = 0; i<user.habitsTimer.length; i++){
            totalTimeViewedHabits = totalTimeViewedHabits + user.habitsTimer[i];
          }
        }
        res.set({
          'Content-Type': 'application/json; charset=UTF-8',
        })
        res.json({
          startTime: startTime,
          totalTimeViewedHabits:totalTimeViewedHabits
        });
      });
};

/*
* POST /updateName
* Update profile information with name input by an instructor
*/
exports.postName = (req, res, next) => {
  User.findOne({
    accessCode: req.body.accessCode,
    username: req.body.username
  }).exec(function(err, student) {
    if (err) {
      console.log("ERROR");
      console.log(err);
      return next(err);
    }
    if (student == null){
      console.log("NULL");
      var myerr = new Error('Student not found!');
      return next(myerr);
    }
    student.name = req.body.name;
    student.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(`/viewClass/${req.body.accessCode}`);
    });
  });
};

exports.getReflectionCsv = (req, res, next) => {
  User.findById(req.user.id, (err, user) =>{
    if(err) {
      return next(err);
    }
    if(!req.user.isInstructor) {
      res.redirect('/login');
    }
    let reflectionCsv = '';
    if(user.reflectionCsv) {
       reflectionCsv = user.reflectionCsv;
    }
    res.set('Content-Type', 'text/csv');
    res.send(reflectionCsv);
  });
};

exports.getTimeReportCsv = (req, res, next) => {
  User.findById(req.user.id, (err, user) =>{
    if(err) {
      return next(err);
    }
    if(!req.user.isInstructor) {
      res.redirect('/login');
    }
    let timeReportCsv = '';
    if(user.timeReportCsv) {
       timeReportCsv = user.timeReportCsv;
    }
    res.set('Content-Type', 'text/csv');
    res.send(timeReportCsv);
  });
};

/**
 * POST /account/profile
 * Update profile information.Which ad topic did the user pick?
 */
exports.postUpdateInterestSelection = (req, res, next) => {

  User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    let userTopic = user.targetedAdTopic;
    switch(req.body.subdirectory2){
      case 'targeted':
        userTopic = user.targetedAdTopic;
        break;
      case 'esteem':
        userTopic = user.esteemTopic;
        break;
    }
    if (userTopic) {
      // this is NOT the first topic selected
      userTopic.push(req.body.chosenTopic);
    } else {
      // this IS the first topic selected
      userTopic = [req.body.chosenTopic];
    }

    user.save((err) => {
      if (err) {
        return next(err);
      }
      res.send({
        result:"success"
      });
    });
  });
};

exports.getEsteemTopic = (req, res) => {
    User.findById(req.user.id)
      .exec(function (err, user){
        let selectedTopic = user.esteemTopic[user.esteemTopic.length - 1];
        console.log(`Topic: ${selectedTopic}`);
        res.set({
          'Content-Type': 'application/json; charset=UTF-8',
        })
        res.send({
          esteemTopic: selectedTopic
        });
      });
};

/**
 * POST /account/profile
 * Update profile information.Which ad topic did the user pick? Esteem module only.
 */
exports.postAdvancedlitInterestSelection = (req, res, next) => {

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }

    user.advancedlitTopic = req.body.chosenTopic || '';

    user.save((err) => {
      if (err) {
        return next(err);
      }
      res.send({
        result:"success"
      });
    });
  });
};

exports.getAdvancedlitTopic = (req, res) => {
    User.findById(req.user.id)
      .exec(function (err, user){
        let selectedTopic = user.advancedlitTopic;
        res.json({advancedlitTopic: selectedTopic});
      });
};

/**
 * POST /account/profile
 * Update profile information. How long has the user looked at the free-play section? Habits module only.
 */
exports.postUpdateHabitsTimer = (req, res, done) => {

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    if(req.body.habitsTimer){ //we are adding another view time to the array
      if (user.habitsTimer){
        user.habitsTimer.push(req.body.habitsTimer);
      } else {
        user.habitsTimer = [req.body.habitsTimer];
      }
    }
    if (req.body.habitsStart) { //we are trying to record when the user first opened the free-play section
      if(user.firstHabitViewTime == -1){ //only write this value if there's no value written yet, since user can revisit the feed
        user.firstHabitViewTime = req.body.habitsStart;
      }
    }
    user.save((err) => {
      if (err) {
        return next(err);
      }
      if (req.body.habitsStart){
        res.json({url:'/modual/habits'});
      } else {
        res.send({result:"success"});
      }
    });
  });
};


/**
 * Post update on module progress
 */
exports.postUpdateModuleProgress = (req, res, next) => {

  User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    // Once marked completed, do not update status again.
    if(user.moduleProgress[req.body.module] !== 'completed'){
      user.moduleProgress[req.body.module] = req.body.status;
    }
    user.save((err) => {
      if (err) {
        return next(err);
      }
      res.send({
        result:"success"
      });
    });
  });
};

exports.postUpdateNewBadge = (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    // check if the user already has earned this badge
    for(const badge of user.earnedBadges){
      if(badge.badgeId === req.body.badgeId){
        return res.sendStatus(200);
      }
    }
    // otherwise, create a new badge using the info in the request body
    const newBadge = {
      badgeId: req.body.badgeId,
      badgeTitle: req.body.badgeTitle,
      badgeImage: req.body.badgeImage,
      dateEarned: Date.now()
    }
    user.earnedBadges.push(newBadge);
    user.save((err) => {
      if (err) {
        return next(err);
      }
      return res.sendStatus(200);
    });
  });
}


exports.getStudentReportData = (req, res, next) => {
  if (!req.user.isInstructor) {
    return res.json({studentPageTimes: {}});
  }
  User.findOne({
    accessCode: req.params.classId,
    username: req.params.username,
    deleted: false
  }).exec(function (err, student) {
    if (err) {
      console.log("ERROR");
      console.log(err);
      return next(err);
    }
    if (student == null){
      console.log("NULL");
      var myerr = new Error('Student not found!');
      return next(myerr);
    }
    // get progress on each module
    // add dashes to the keys that usually have them
    let moduleProgress = {};
    moduleProgress["safe-posting"] = student.moduleProgress['safeposting'];
    moduleProgress["digital-literacy"] = student.moduleProgress['digitalliteracy'];
    for(const key of Object.keys(student.moduleProgress)){
      if(key !== "digitalliteracy" && key !== "safeposting")
      moduleProgress[key] = student.moduleProgress[key];
    }

    // get page times
    const pageLog = student.pageLog;
    let pageTimeArray = [];
    for(let i=0, l=pageLog.length-1; i<l; i++) {
      // convert from ms to minutes
      let timeDurationOnPage = (pageLog[i+1].time - pageLog[i].time)/60000;
      // skip any page times longer than 30 minutes
      if(timeDurationOnPage > 30) {
        continue;
      }
      const dataToPush = {
        timeOpened: pageLog[i].time,
        timeDuration: timeDurationOnPage,
        subdirectory1: pageLog[i].subdirectory1
      };
      if (pageLog[i].subdirectory2) {
        dataToPush["subdirectory2"] = pageLog[i].subdirectory2;
      }
      pageTimeArray.push(dataToPush);
    }

    // get freeplay actions
    const freeplayActions = student.feedAction;

    res.json({
      pageTimes: pageTimeArray,
      moduleProgress: moduleProgress,
      freeplayActions: freeplayActions
    });
  });
}

function getDateLastAccessed(pageLog, modName) {
  /*
  New pageLog item added each time a user opens a page.
  pageLog: [new Schema({
    time: Date,
    subdirectory1: String,
    subdirectory2: String
  })]
  */
  let lastAccessed = 0;
  for(const page of pageLog) {
    if (page.subdirectory2 === modName) {
      if (page.time > lastAccessed) {
        lastAccessed = page.time;
      }
    }
  }
  return lastAccessed;
}

exports.getLearnerGeneralModuleData = (req, res, next) => {
  if (!req.user.isStudent){
    return res.status(400).send('Bad Request')
  }
  let moduleStatuses = {};
  // get a list of module names, with dashes added where needed
  let allModNames = [];
  for(const modName of Object.keys(req.user.moduleProgress.toJSON())){
    /*
    from the User model:
    moduleProgress: { // marks the progress of each module: none, started, completed
      accounts: {type: String, default: 'none'},
      ...
      targeted: {type: String, default: 'none'}
    },
    */
    if (modName === "digitalliteracy") {
      allModNames.push('digital-literacy');
    } else if (modName === "safeposting") {
      allModNames.push('safe-posting');
    } else {
      allModNames.push(modName);
    }
  }
  for(const modName of allModNames){
    const modNameNoDashes = modName.replace('-','');  // modNames in user.moduleProgress do not have dashes where they usually do
    moduleStatuses[modName] = {};
    moduleStatuses[modName]['status'] = req.user.moduleProgress[modNameNoDashes];
    moduleStatuses[modName]['lastAccessed'] = getDateLastAccessed(req.user.pageLog, modName);
    moduleStatuses[modName]['likes'] = 0;
    moduleStatuses[modName]['flags'] = 0;
    moduleStatuses[modName]['replies'] = 0;
    // get timeline action counts
    for (const post of req.user.feedAction) {
      // ignore posts that aren't in the relevant module
      if (post.modual !== modName) {
        continue;
      }
      if (post.liked) {
        moduleStatuses[modName].likes++;
      }
      if (post.flagged) {
        moduleStatuses[modName].flags++;
      }
      for(const comment of post.comments){
        if(comment.new_comment){
          moduleStatuses[modName].replies++;
        }
      }
    }
  }
  res.send(moduleStatuses);
}

async function getSectionJsonFromFile(filePath) {
  let readFilePromise = function(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      })
    })
  }
  const sectionJsonBuffer = await readFilePromise(filePath).then(function(data) {
    return data;
  });
  let sectionJson;
  try {
    sectionJson = JSON.parse(sectionJsonBuffer);
  } catch (err) {
    return next(err);
  }
  return sectionJson;
}

exports.getLearnerSectionTimeData = async (req, res, next) => {
  if (!req.user.isStudent){
    return res.status(400).send('Bad Request')
  }
  const pageLog = req.user.pageLog;
  /*
  New pageLog item added each time a user opens a page.
  pageLog: [new Schema({
    time: Date,
    subdirectory1: String,
    subdirectory2: String
  })]
  */

  let allSectionTimeData = {
    'accounts': { 'learn': 0,'explore': 0, 'practice': 0,'reflect': 0},
    'advancedlit': { 'learn': 0,'explore': 0,'practice': 0,'reflect': 0},
    'cyberbullying': { 'learn': 0,'explore': 0,'practice': 0,'reflect': 0},
    'digfoot': { 'learn': 0,'explore': 0,'practice': 0,'reflect': 0},
    'digital-literacy': { 'learn': 0,'explore': 0,'practice': 0,'reflect': 0},
    'esteem': { 'learn': 0,'explore': 0,'practice': 0,'reflect': 0},
    'habits': { 'learn': 0,'explore': 0,'practice': 0,'reflect': 0},
    'phishing': { 'learn': 0,'explore': 0,'practice': 0,'reflect': 0},
    'presentation': { 'learn': 0,'explore': 0,'practice': 0,'reflect': 0},
    'privacy': { 'learn': 0,'explore': 0,'practice': 0,'reflect': 0},
    'safe-posting': { 'learn': 0,'explore': 0,'practice': 0,'reflect': 0},
    'targeted': { 'learn': 0,'explore': 0,'practice': 0,'reflect': 0}
  }
  // First, need to get the mappings between module pages and section numbers
  const sectionDataA = await getSectionJsonFromFile("./public2/json/progressDataA.json");
  const sectionDataB = await getSectionJsonFromFile("./public2/json/progressDataB.json");
  /* Short example of the data in progressDataA and progressDataB:
    {
      "start": "1",
      "sim": "2",
      "trans_script": "3",
      "modual": "3",
      "results": "4",
      "end": "end"
    }
    where the key corresponds to page name, value corresponds to a section number
    1 = "learn" section
    2 = "practice" section
    3 = "explore" section
    4 = "reflect" section
  */
  for(const modName of Object.keys(allSectionTimeData)){
    // if module has not been completed, skip it
    const modNameNoDashes = modName.replace('-','');
    // modNames in user.moduleProgress do not have dashes where they usually do
    if(req.user.moduleProgress[modNameNoDashes] !== "completed"){
      continue;
    }
    // select the corresponding sectionData, A or B, to use depending on the module
    let sectionJson = {};
    switch (modName) {
      case 'cyberbullying':
      case 'digfoot':
        sectionJson = sectionDataB;
        break;
      default:
        sectionJson = sectionDataA;
        break;
    }
    for(let i=0, l=pageLog.length-1; i<l; i++) {
      // skip pageLog entries that are not for the specified module
      if ((!pageLog[i].subdirectory2) || (pageLog[i].subdirectory2 !== modName)) {
        continue;
      }
      // convert from ms to minutes
      let timeDurationOnPage = (pageLog[i+1].time - pageLog[i].time)/60000;
      // skip any page times that are longer than 30 minutes
      if(timeDurationOnPage > 30) {
        continue;
      }
      // add the page time to the appropriate section's total time:
      const sectionNumber = sectionJson[pageLog[i].subdirectory1];
      if (sectionNumber === "1") {
        allSectionTimeData[modName].learn += timeDurationOnPage;
      } else if (sectionNumber === "2") {
        allSectionTimeData[modName].practice += timeDurationOnPage;
      } else if (sectionNumber === "3") {
        allSectionTimeData[modName].explore += timeDurationOnPage;
      } else if (sectionNumber === "4") {
        allSectionTimeData[modName].reflect += timeDurationOnPage;
      } else {
        continue;
      }
    }
    // round each number using Math.round (note that this is inconsistent with
    // the teacher dashbord time displays, which all round using Math.floor)
    for(const section of Object.keys(allSectionTimeData[modName])) {
      allSectionTimeData[modName][section] = Math.round(allSectionTimeData[modName][section]);
    }
  }
  res.send(allSectionTimeData);
}

exports.getLearnerEarnedBadges = (req, res, next) => {
  if (!req.user.isStudent) {
    return res.status(400).send('Bad Request')
  }
  let earnedBadges = [];
  for (const badge of req.user.earnedBadges) {
    /*
    earnedBadges: [new Schema({
      badgeId: String,
      badgeTitle: String,
      badgeImage: String,
      dateEarned: Date
    })],
    */
    const badgeInfo = {
      title: badge.badgeTitle,
      image: badge.badgeImage
    };
    earnedBadges.push(badgeInfo);
  }
  res.send(earnedBadges);
}


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
    return res.redirect('/account/'+req.param("modId"));
  }

  User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    user.profile.name = req.body.name || '';
    user.profile.location = req.body.location || '';
    user.profile.bio = req.body.bio || '';
    user.profile.picture = req.body.profilePhoto;

    // log the change in profileHistory

    let cat = new Object();

    cat.absoluteTimeChanged = Date.now();
    cat.name = req.body.name || '';
    cat.location = req.body.location || '';
    cat.bio = req.body.bio || '';
    cat.picture= req.body.profilePhoto || '';

    user.profileHistory.push(cat);


    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', {
            msg: `The email address you have entered is already associated with
            an account.`
          });
          res.redirect('/modual/'+req.param("modId"));
        }
        return next(err);
      }
      res.redirect('/modual/'+req.param("modId"));
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
  // Is this a guest account?
  if(typeof req.user.isGuest !== 'undefined' && req.user.isGuest) {
    User.remove({ _id: req.user.id }, (err) => {
      if (err) {
        return next(err);
      }
      req.logout();
      res.send({
        result: "success"
      });
    });
  } else {
    //console.log("Deleting user feed posts Actions")
    User.findById(req.user.id, (err, user) => {
      //somehow user does not exist here
      if (err) { return next(err); }
      //console.log("@@@@@@@@@@@  /deleteUserFeedActions req body  ", req.body);

      user.feedAction =[];
      user.save((err) => {
        if (err) {
          if (err.code === 11000) {
            req.flash('errors', { msg: 'Something in delete feedAction went crazy. You should never see this.' });
            return res.redirect('/');
          }
          return next(err);
        }
        res.send({result:"success"});
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
